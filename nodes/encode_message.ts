import { EncodeMessageInput, EncodeMessageResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, normalizeEnumFieldNames } from './lib';

/**
 * Encodes a JSON value to protobuf wire-format bytes (base64-encoded) for
 * a message type looked up by name within the given schema. Enum fields
 * may be given as either their member name string (matching what
 * DecodeMessage and GetMessageFields both report) or their numeric id, at
 * any nesting depth. The value is verified against the message's own
 * field shape (`Type#verify`) BEFORE encoding, so a value with a
 * wrong-typed field is rejected with a structured error rather than
 * silently coerced (protobufjs's own `fromObject` would otherwise turn an
 * invalid value into a null/default field with no indication anything was
 * wrong).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function encodeMessage(ax: AxiomContext, input: EncodeMessageInput): EncodeMessageResult {
  const out = new EncodeMessageResult();
  const jsonValue = input.getJsonValue();

  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setOk(false);
    out.setError(parsed.errors[0]?.getMessage() ?? 'schema failed to parse');
    return out;
  }

  const messageName = input.getMessageName();
  const type = lookupMessage(parsed.root, messageName);
  if (!type) {
    out.setOk(false);
    out.setError(`no message named "${messageName}" found in schema`);
    return out;
  }

  let value: unknown;
  try {
    value = JSON.parse(jsonValue);
  } catch (e) {
    out.setOk(false);
    out.setError(`json_value is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return out;
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    out.setOk(false);
    out.setError('json_value must be a JSON object');
    return out;
  }

  // See normalizeEnumFieldNames' doc comment: Type#verify() (unlike
  // fromObject()) rejects a valid enum member-name string, so normalize
  // those to their numeric id first — a string that does NOT name a real
  // member is left untouched, so verify() still rejects it below.
  const normalized = normalizeEnumFieldNames(type, value) as Record<string, unknown>;

  // Reject BEFORE encoding rather than let fromObject() silently coerce a
  // wrong-typed field to null (verified against protobufjs 8.7.1:
  // Type#fromObject does not throw on a type mismatch, it drops the value).
  const verifyError = type.verify(normalized);
  if (verifyError) {
    out.setOk(false);
    out.setError(verifyError);
    return out;
  }

  try {
    const message = type.fromObject(normalized);
    const bytes = type.encode(message).finish();
    out.setOk(true);
    out.setWireBytesBase64(Buffer.from(bytes).toString('base64'));
    out.setByteLength(bytes.byteLength);
    return out;
  } catch (e) {
    out.setOk(false);
    out.setError(e instanceof Error ? e.message : String(e));
    return out;
  }
}
