import { SchemaInput, ToJsonDescriptorResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText } from './lib';

/**
 * Converts a parsed schema to protobufjs's JSON descriptor representation
 * (`Root#toJSON()`'s nested-namespace object tree of messages/enums/
 * services/options, keyed by name at each nesting level), serialized as a
 * JSON string. This is protobufjs's own canonical machine-readable schema
 * format, suitable for reconstructing a `protobuf.Root` elsewhere via
 * `Root.fromJSON(...)` without re-parsing the original .proto text.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function toJsonDescriptor(ax: AxiomContext, input: SchemaInput): ToJsonDescriptorResult {
  const out = new ToJsonDescriptorResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setDescriptorJson(JSON.stringify(parsed.root.toJSON()));
  return out;
}
