import { DecodeMessageInput, DecodeMessageResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, byteLength, MAX_PAYLOAD_BYTES } from './lib';

/**
 * Decodes base64-encoded protobuf wire-format bytes back to a JSON value
 * for a message type looked up by name within the given schema. Malformed
 * wire bytes (truncated, corrupt tag encoding, or bytes that don't
 * correspond to this message's field shape) return ok=false with a
 * structured error instead of throwing. Input bytes are capped at 3 MiB,
 * well under Axiom's ~4 MiB node-transport limit.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function decodeMessage(ax: AxiomContext, input: DecodeMessageInput): DecodeMessageResult {
  const out = new DecodeMessageResult();
  const wireBytesBase64 = input.getWireBytesBase64();
  if (byteLength(wireBytesBase64) > MAX_PAYLOAD_BYTES) {
    out.setOk(false);
    out.setError(`wire_bytes_base64 exceeds the ${MAX_PAYLOAD_BYTES}-byte payload limit`);
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

  let bytes: Buffer;
  try {
    bytes = Buffer.from(wireBytesBase64, 'base64');
  } catch (e) {
    out.setOk(false);
    out.setError(`wire_bytes_base64 is not valid base64: ${e instanceof Error ? e.message : String(e)}`);
    return out;
  }
  if (bytes.byteLength > MAX_PAYLOAD_BYTES) {
    out.setOk(false);
    out.setError(`decoded payload exceeds the ${MAX_PAYLOAD_BYTES}-byte payload limit`);
    return out;
  }

  try {
    const message = type.decode(bytes);
    const obj = type.toObject(message, { longs: String, enums: String, bytes: String });
    out.setOk(true);
    out.setJsonValue(JSON.stringify(obj));
    return out;
  } catch (e) {
    out.setOk(false);
    out.setError(e instanceof Error ? e.message : String(e));
    return out;
  }
}
