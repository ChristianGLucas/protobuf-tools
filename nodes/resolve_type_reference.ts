import { ResolveTypeReferenceInput, ResolveTypeReferenceResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import * as protobuf from 'protobufjs';
import { parseSchemaText, SCALAR_TYPES, lookupMessageFromContext, fullNameOf } from './lib';

/**
 * Resolves a type-reference string (a scalar keyword, e.g. "int32"; a
 * bare/relative name, e.g. "Inner"; or an absolute dotted name, e.g.
 * ".demo.v1.Outer.Inner") to its fully-qualified form, using protobufjs's
 * own scope-climbing namespace lookup — the identical algorithm protoc
 * uses to resolve a field's type reference from within its declaring
 * message. Set context_message to resolve relative to that message's
 * scope (its enclosing message and package, walking outward); omit it to
 * resolve from the file's package scope directly. resolved=false with
 * kind="unknown" if nothing matches.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function resolveTypeReference(ax: AxiomContext, input: ResolveTypeReferenceInput): ResolveTypeReferenceResult {
  const out = new ResolveTypeReferenceResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setResolved(false);
    out.setKind('unknown');
    out.setError(parsed.errors[0]?.getMessage() ?? 'schema failed to parse');
    return out;
  }

  const typeName = input.getTypeName();
  if (!typeName) {
    out.setResolved(false);
    out.setKind('unknown');
    out.setError('type_name must not be empty');
    return out;
  }

  // Strip a leading dot for the scalar check only — ".int32" is not a
  // valid scalar reference in real .proto grammar (scalars are never
  // written absolute), but treating it identically to "int32" here would
  // be misleading; scalar keywords are simply never dot-prefixed.
  if (SCALAR_TYPES.has(typeName)) {
    out.setResolved(true);
    out.setFullyQualifiedName(typeName);
    out.setKind('scalar');
    return out;
  }

  const found = lookupMessageFromContext(parsed.root, typeName, input.getContextMessage());
  if (!found) {
    out.setResolved(false);
    out.setKind('unknown');
    out.setError(`"${typeName}" did not resolve to any message, enum, or scalar type`);
    return out;
  }
  out.setResolved(true);
  out.setFullyQualifiedName(fullNameOf(found));
  out.setKind(found instanceof protobuf.Enum ? 'enum' : 'message');
  return out;
}
