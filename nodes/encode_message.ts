import { EncodeMessageInput, EncodeMessageResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, byteLength, MAX_PAYLOAD_BYTES } from './lib';

/**
 * Encodes a JSON value to protobuf wire-format bytes (base64-encoded) for
 * a message type looked up by name within the given schema. The JSON
 * value is verified against the message's own field shape (`Type#verify`)
 * BEFORE encoding, so a value with a wrong-typed field is rejected with a
 * structured error rather than silently coerced (protobufjs's own
 * `fromObject` would otherwise turn an invalid value into a null/default
 * field with no indication anything was wrong). The encoded payload is
 * capped at 3 MiB — comfortably under Axiom's ~4 MiB node-transport limit
 * — and rejects an oversized json_value up front rather than attempting
 * the encode.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function encodeMessage(ax: AxiomContext, input: EncodeMessageInput): EncodeMessageResult {
  const out = new EncodeMessageResult();
  const jsonValue = input.getJsonValue();
  if (byteLength(jsonValue) > MAX_PAYLOAD_BYTES) {
    out.setOk(false);
    out.setError(`json_value exceeds the ${MAX_PAYLOAD_BYTES}-byte payload limit`);
    return out;
  }

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

  // Reject BEFORE encoding rather than let fromObject() silently coerce a
  // wrong-typed field to null (verified against protobufjs 8.7.1:
  // Type#fromObject does not throw on a type mismatch, it drops the value).
  const verifyError = type.verify(value as Record<string, unknown>);
  if (verifyError) {
    out.setOk(false);
    out.setError(verifyError);
    return out;
  }

  try {
    const message = type.fromObject(value as Record<string, unknown>);
    const bytes = type.encode(message).finish();
    if (bytes.byteLength > MAX_PAYLOAD_BYTES) {
      out.setOk(false);
      out.setError(`encoded message exceeds the ${MAX_PAYLOAD_BYTES}-byte payload limit`);
      return out;
    }
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
