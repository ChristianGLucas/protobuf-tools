// Shared parse/reflection/error-formatting logic for every protobuf-tools
// node. Every node file is a thin wrapper: decode proto input -> call a
// helper (which does the real work through protobufjs's own parser and
// reflection API) -> encode proto output. Keeping the protobufjs-specific
// glue here (rather than duplicated per node) is what keeps error shape
// and default-value computation consistent across nodes.

import * as protobuf from 'protobufjs';
import {
  Location,
  ProtoError,
  OptionEntry,
  FieldInfo,
  MessageSummary,
  EnumValueInfo,
  EnumSummary,
  MethodInfo,
  ServiceSummary,
  ReservedRange,
} from '../gen/messages_pb';

// ── Structured errors ────────────────────────────────────────────────────

export function mkLocation(line: number, column: number): Location {
  const l = new Location();
  l.setLine(line);
  l.setColumn(column);
  return l;
}

export function mkError(message: string, line = 0, column = 0): ProtoError {
  const e = new ProtoError();
  e.setMessage(message);
  e.setLocation(mkLocation(line, column));
  return e;
}

// protobufjs syntax errors from its hand-written tokenizer/parser throw a
// plain Error whose message ends in "(line N)" — e.g. "illegal token
// 'message', ';' expected (line 3)". There is no column. Other thrown
// errors (duplicate field id, reserved-range conflict caught at parse
// time, an unresolved type from resolveAll()) carry no location at all.
const LINE_RE = /\(line (\d+)\)\s*$/;

export function errorFromException(e: unknown): ProtoError {
  const message = e instanceof Error ? e.message : String(e);
  const m = LINE_RE.exec(message);
  const line = m ? parseInt(m[1], 10) : 0;
  return mkError(message, line, 0);
}

// ── Parsing ──────────────────────────────────────────────────────────────

export interface ParseOutcome {
  root: protobuf.Root | null;
  pkg: string;
  imports: string[];
  errors: ProtoError[];
}

// Parses raw .proto text with protobufjs. Never throws: a genuine syntax
// error comes back as a structured ProtoError in `errors` with
// `root: null`.
export function parseSchemaText(schema: string): ParseOutcome {
  try {
    const result = protobuf.parse(schema, new protobuf.Root(), { keepCase: true });
    // Best-effort semantic resolution. This populates per-field feature
    // flags (required/hasPresence) and resolvedType/resolvedRequestType/
    // resolvedResponseType, which live in a separate, EARLIER pass inside
    // resolveAll() than type-reference resolution itself (verified against
    // protobufjs 8.7.1 source: Namespace#resolveAll runs
    // `_resolveFeaturesRecursive` over the WHOLE tree before it ever calls
    // `resolve()` on an individual field, so a single unresolvable
    // reference elsewhere in the schema still leaves every field's own
    // features correctly populated). A resolution failure here is
    // deliberately swallowed — inspection nodes should still return their
    // best-effort structural answer for a schema with some dangling
    // reference; ValidateSchema is the dedicated node that reports this
    // failure as an error.
    try {
      result.root.resolveAll();
    } catch {
      // swallowed — see comment above.
    }
    return {
      root: result.root,
      pkg: result.package || '',
      imports: result.imports || [],
      errors: [],
    };
  } catch (e) {
    return { root: null, pkg: '', imports: [], errors: [errorFromException(e)] };
  }
}

// Parses AND runs full semantic reference resolution (every field/method
// type reference must resolve to a real message or enum). resolveAll()'s
// own errors carry no location.
// Deliberately does NOT reuse parseSchemaText's root. protobufjs 8.7.1's
// resolveAll() is only "loud" on the FIRST call per Root instance: a
// second call on the same (already-attempted) root returns silently even
// when a reference genuinely never resolved (verified empirically —
// resolvedType stays null, but no exception on the retry). Since
// parseSchemaText already calls resolveAll() once itself (swallowed, to
// populate field features for the inspection nodes), reusing that root
// here would silently report valid=true for a genuinely broken schema.
// Parsing fresh guarantees this is the first-and-only resolveAll() call
// on this root.
export function validateSchemaText(schema: string): { valid: boolean; errors: ProtoError[] } {
  let root: protobuf.Root;
  try {
    root = protobuf.parse(schema, new protobuf.Root(), { keepCase: true }).root;
  } catch (e) {
    return { valid: false, errors: [errorFromException(e)] };
  }
  try {
    root.resolveAll();
    return { valid: true, errors: [] };
  } catch (e) {
    return { valid: false, errors: [errorFromException(e instanceof Error ? e : String(e))] };
  }
}

// ── Syntax detection ─────────────────────────────────────────────────────
// protobufjs's parse() result does NOT expose the declared syntax/edition
// (verified against protobufjs 8.7.1: the parser tracks it only in a
// private per-top-level-object `_edition` field, unset on nested types —
// unreliable for our purposes). The syntax/edition statement is a fixed,
// unambiguous single-line declaration that (per the language spec) must
// be the first non-comment, non-blank statement in the file, so reading
// it directly off the source text is exact, not a heuristic re-parse of
// anything protobufjs itself interprets.
const SYNTAX_RE = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*syntax\s*=\s*"([^"]+)"\s*;/;
const EDITION_RE = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*edition\s*=\s*"([^"]+)"\s*;/;

export function detectSyntax(schema: string): { syntax: string; declared: boolean } {
  const syntaxMatch = SYNTAX_RE.exec(schema);
  if (syntaxMatch) return { syntax: syntaxMatch[1], declared: true };
  const editionMatch = EDITION_RE.exec(schema);
  if (editionMatch) return { syntax: editionMatch[1], declared: true };
  return { syntax: 'unspecified', declared: false };
}

// ── Scalar types & defaults ─────────────────────────────────────────────

export const SCALAR_TYPES = new Set([
  'double', 'float', 'int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64',
  'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'bool', 'string', 'bytes',
]);

const ZERO_VALUES: Record<string, string> = {
  double: '0', float: '0', int32: '0', int64: '0', uint32: '0', uint64: '0',
  sint32: '0', sint64: '0', fixed32: '0', fixed64: '0', sfixed32: '0', sfixed64: '0',
  bool: 'false', string: '', bytes: '',
};

// Computes a field's effective default: the explicit proto2 `[default =
// ...]` value when present, otherwise the implicit zero-value per the
// protobuf spec (scalar zero-value, the enum's own 0-numbered value's
// name, or "" for a message/repeated/map field, none of which have a
// scalar default).
function effectiveDefault(field: protobuf.Field): { explicit: boolean; value: string } {
  const opts = field.options || {};
  if (Object.prototype.hasOwnProperty.call(opts, 'default')) {
    return { explicit: true, value: String(opts['default']) };
  }
  // Neither a repeated field NOR a map field has a scalar default. Both
  // must be checked: protobufjs's own `field.repeated` is FALSE for a map
  // field (verified against protobufjs 8.7.1 — a MapField's `.type` holds
  // its VALUE type, e.g. "int32" for `map<string, int32>`, which would
  // otherwise fall through to the scalar branch below and misreport a
  // map field as defaulting to "0").
  if (field.repeated || field.map) return { explicit: false, value: '' };
  if (SCALAR_TYPES.has(field.type)) {
    return { explicit: false, value: ZERO_VALUES[field.type] ?? '' };
  }
  // Not a scalar: either an enum (zero-valued member's name) or a message
  // (no scalar default).
  try {
    const resolved = field.resolvedType;
    if (resolved instanceof protobuf.Enum) {
      const zeroName = resolved.valuesById[0];
      return { explicit: false, value: zeroName !== undefined ? zeroName : '' };
    }
  } catch {
    // resolvedType access before resolveAll() — fall through to "".
  }
  return { explicit: false, value: '' };
}

export function formatOptionValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  return JSON.stringify(value);
}

export function buildOptionEntries(options: Record<string, unknown> | undefined): OptionEntry[] {
  if (!options) return [];
  return Object.keys(options).map((name) => {
    const oe = new OptionEntry();
    oe.setName(name);
    oe.setValue(formatOptionValue(options[name]));
    return oe;
  });
}

// A top-level `option name = value;` statement attaches to the ROOT
// namespace only when the schema has no `package` declaration (verified
// against protobufjs 8.7.1: a file-level option is recorded on whichever
// namespace object the parser's cursor is in when it reads the option
// statement — for a schema with `package a.b;`, that's the innermost "b"
// namespace created for the package path, NOT root). Reading root.options
// directly would silently return nothing for the (far more common) case
// of a schema that declares a package alongside its options.
export function getFileOptions(root: protobuf.Root, pkg: string): Record<string, unknown> | undefined {
  if (!pkg) return root.options as Record<string, unknown> | undefined;
  const ns = root.lookup(pkg);
  return (ns ? ns.options : root.options) as Record<string, unknown> | undefined;
}

// ── Field / message / enum / service reflection -> proto ────────────────

export function buildFieldInfo(field: protobuf.Field): FieldInfo {
  const fi = new FieldInfo();
  fi.setName(field.name);
  const isMap = field instanceof protobuf.MapField;
  fi.setIsMap(isMap);
  if (isMap) {
    const mf = field as protobuf.MapField;
    fi.setMapKeyType(mf.keyType);
    fi.setType(mf.type);
  } else {
    fi.setType(field.type);
  }
  fi.setNumber(field.id);
  // "repeated" / "required" first (unambiguous, edition-feature-backed);
  // otherwise "optional" only if the field actually tracks presence
  // (proto2 singular fields always do; proto3 only when explicitly
  // declared `optional`, which protobufjs models as membership in a
  // synthetic single-field oneof) — a plain proto3 singular field with no
  // presence tracking reports "" (no label keyword appears in source).
  // Requires resolveAll() to have run at least once (see parseSchemaText)
  // — these getters read per-field "features" that are only populated by
  // that pass; unresolved, every field looks like a bare proto3 singular.
  fi.setLabel(field.repeated ? 'repeated' : field.required ? 'required' : !!field.hasPresence ? 'optional' : '');
  fi.setOneofName(field.partOf ? field.partOf.name : '');
  const def = effectiveDefault(field);
  fi.setExplicitDefault(def.explicit);
  fi.setDefaultValue(def.value);
  fi.setOptionsList(buildOptionEntries(field.options as Record<string, unknown> | undefined));
  return fi;
}

export function buildReservedRanges(reserved: (number[] | string)[] | undefined): {
  ranges: ReservedRange[];
  names: string[];
} {
  const ranges: ReservedRange[] = [];
  const names: string[] = [];
  for (const r of reserved || []) {
    if (typeof r === 'string') {
      names.push(r);
    } else {
      const rr = new ReservedRange();
      rr.setStart(r[0]);
      // protobufjs represents an unbounded "reserved N to max" upper end
      // as a large sentinel (536870911, the max protobuf field number);
      // pass it through as-is rather than reinterpreting it.
      rr.setEnd(r[1]);
      ranges.push(rr);
    }
  }
  return { ranges, names };
}

export function fullNameOf(obj: protobuf.ReflectionObject): string {
  return obj.fullName.replace(/^\./, '');
}

export function buildMessageSummary(type: protobuf.Type): MessageSummary {
  const ms = new MessageSummary();
  ms.setName(type.name);
  ms.setFullName(fullNameOf(type));
  const nestedMessages: string[] = [];
  const nestedEnums: string[] = [];
  for (const nested of type.nestedArray) {
    if (nested instanceof protobuf.Type) nestedMessages.push(nested.name);
    else if (nested instanceof protobuf.Enum) nestedEnums.push(nested.name);
  }
  ms.setNestedMessageNamesList(nestedMessages);
  ms.setNestedEnumNamesList(nestedEnums);
  ms.setFieldCount(type.fieldsArray.length);
  return ms;
}

export function buildEnumSummary(en: protobuf.Enum): EnumSummary {
  const es = new EnumSummary();
  es.setName(en.name);
  es.setFullName(fullNameOf(en));
  const values: EnumValueInfo[] = Object.keys(en.values).map((name) => {
    const ev = new EnumValueInfo();
    ev.setName(name);
    ev.setNumber(en.values[name]);
    return ev;
  });
  es.setValuesList(values);
  return es;
}

export function buildMethodInfo(method: protobuf.Method): MethodInfo {
  const mi = new MethodInfo();
  mi.setName(method.name);
  const req = method.resolvedRequestType;
  const res = method.resolvedResponseType;
  mi.setInputType(req ? fullNameOf(req) : method.requestType);
  mi.setOutputType(res ? fullNameOf(res) : method.responseType);
  mi.setClientStreaming(!!method.requestStream);
  mi.setServerStreaming(!!method.responseStream);
  mi.setOptionsList(buildOptionEntries(method.options as Record<string, unknown> | undefined));
  return mi;
}

export function buildServiceSummary(svc: protobuf.Service): ServiceSummary {
  const ss = new ServiceSummary();
  ss.setName(svc.name);
  ss.setFullName(fullNameOf(svc));
  ss.setMethodsList(svc.methodsArray.map((m) => buildMethodInfo(m)));
  return ss;
}

// Depth-first walk of every message in the tree (top-level and nested, in
// declaration order).
export function walkMessages(ns: protobuf.NamespaceBase, out: MessageSummary[] = []): MessageSummary[] {
  for (const nested of ns.nestedArray) {
    if (nested instanceof protobuf.Type) {
      out.push(buildMessageSummary(nested));
      walkMessages(nested, out);
    } else if (nested instanceof protobuf.Namespace && !(nested instanceof protobuf.Service)) {
      walkMessages(nested, out);
    }
  }
  return out;
}

export function walkEnums(ns: protobuf.NamespaceBase, out: EnumSummary[] = []): EnumSummary[] {
  for (const nested of ns.nestedArray) {
    if (nested instanceof protobuf.Enum) {
      out.push(buildEnumSummary(nested));
    } else if (nested instanceof protobuf.Type) {
      walkEnums(nested, out);
    } else if (nested instanceof protobuf.Namespace && !(nested instanceof protobuf.Service)) {
      walkEnums(nested, out);
    }
  }
  return out;
}

export function walkServices(ns: protobuf.NamespaceBase, out: ServiceSummary[] = []): ServiceSummary[] {
  for (const nested of ns.nestedArray) {
    if (nested instanceof protobuf.Service) {
      out.push(buildServiceSummary(nested));
    } else if (nested instanceof protobuf.Namespace) {
      // Covers both plain package namespaces (`package a.b;`) and Type
      // (a message) — real .proto grammar never nests a service inside a
      // message, but walking uniformly costs nothing and needs no
      // special-casing.
      walkServices(nested, out);
    }
  }
  return out;
}

// ── Field-number / reserved-range conflict detection ────────────────────
// Delegates the actual range/name membership test to protobufjs's own
// `Type#isReservedId` / `Type#isReservedName` (used internally by
// `Type#add` to reject a field at parse time) rather than re-implementing
// range-membership logic — the one thing this node adds on top is
// checking EVERY field regardless of declaration order (see
// ListFieldNumbersResult's field docs for why that matters: protobufjs
// itself only catches the field-after-reserved-statement ordering).
export function findReservedConflicts(type: protobuf.Type): { numbers: number[]; names: string[] } {
  const numbers: number[] = [];
  const names: string[] = [];
  for (const field of type.fieldsArray) {
    if (type.isReservedId(field.id)) numbers.push(field.id);
    if (type.isReservedName(field.name)) names.push(field.name);
  }
  return { numbers, names };
}

// ── Encode-side enum-name normalization ──────────────────────────────────
// protobufjs's Type#fromObject() accepts an enum field given as EITHER its
// numeric id or its member name string, resolving the name recursively at
// any depth. Type#verify() does NOT: it rejects a valid member name string
// outright ("role: enum value expected"), even though the exact same value
// passed straight to fromObject() converts correctly (verified against
// protobufjs 8.7.1). Since EncodeMessage calls verify() first — precisely
// so a genuinely wrong-typed field is rejected instead of silently
// coerced by fromObject() — that mismatch meant a caller could never
// round-trip DecodeMessage's own output (which renders enums as their
// name string, matching GetMessageFields' documented convention) back
// through EncodeMessage. This walks the value tree, using the message's
// own field/type reflection to find enum-typed fields (scalar, repeated,
// or a map's value) and resolves any string that names a real member to
// its number — leaving anything else (including an unrecognized string)
// untouched so verify() still catches a genuine type error.
export function normalizeEnumFieldNames(type: protobuf.Type, value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = { ...obj };
  for (const field of type.fieldsArray) {
    const key = Object.prototype.hasOwnProperty.call(out, field.name)
      ? field.name
      : Object.prototype.hasOwnProperty.call(out, field.protoName || '')
        ? (field.protoName as string)
        : null;
    if (key === null) continue;
    const resolved = field.resolvedType;
    const normalizeOne = (v: unknown): unknown => {
      if (resolved instanceof protobuf.Enum && typeof v === 'string') {
        const num = resolved.values[v];
        return num !== undefined ? num : v;
      }
      if (resolved instanceof protobuf.Type) {
        return normalizeEnumFieldNames(resolved, v);
      }
      return v;
    };
    const fieldValue = out[key];
    if (field instanceof protobuf.MapField) {
      if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
        const mapOut: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(fieldValue as Record<string, unknown>)) mapOut[k] = normalizeOne(v);
        out[key] = mapOut;
      }
    } else if (field.repeated && Array.isArray(fieldValue)) {
      out[key] = fieldValue.map(normalizeOne);
    } else {
      out[key] = normalizeOne(fieldValue);
    }
  }
  return out;
}

// ── Lookups ──────────────────────────────────────────────────────────────

export function lookupMessage(root: protobuf.Root, name: string): protobuf.Type | null {
  if (!name) return null;
  try {
    const found = root.lookup(name, [protobuf.Type]);
    return found instanceof protobuf.Type ? found : null;
  } catch {
    return null;
  }
}

export function lookupService(root: protobuf.Root, name: string): protobuf.Service | null {
  if (!name) return null;
  try {
    const found = root.lookup(name, [protobuf.Service]);
    return found instanceof protobuf.Service ? found : null;
  } catch {
    return null;
  }
}

export function lookupMessageFromContext(
  root: protobuf.Root,
  typeName: string,
  contextMessageName: string
): protobuf.ReflectionObject | null {
  if (!typeName) return null;
  const startNs: protobuf.NamespaceBase = contextMessageName
    ? lookupMessage(root, contextMessageName) || root
    : root;
  try {
    return startNs.lookup(typeName, [protobuf.Type, protobuf.Enum]);
  } catch {
    return null;
  }
}
