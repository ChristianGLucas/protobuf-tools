import { MessageNameInput, GetMessageFieldsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, buildFieldInfo, fullNameOf } from './lib';

/**
 * Looks up one message by simple or fully-qualified dotted name (resolved
 * the same way a .proto type reference resolves — walking outward from
 * the package scope) and returns every field it declares directly: name,
 * declared type, field number, label (repeated/required/optional/""), map
 * key/value shape, oneof membership, field-level options, and effective
 * default value (the explicit proto2 `[default = ...]` when present,
 * otherwise the type's implicit proto3 zero-value). found=false with a
 * structured error if the schema fails to parse or no such message
 * exists.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getMessageFields(ax: AxiomContext, input: MessageNameInput): GetMessageFieldsResult {
  const out = new GetMessageFieldsResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setFound(false);
    out.setError(parsed.errors[0]?.getMessage() ?? 'schema failed to parse');
    return out;
  }
  const messageName = input.getMessageName();
  const type = lookupMessage(parsed.root, messageName);
  if (!type) {
    out.setFound(false);
    out.setError(`no message named "${messageName}" found in schema`);
    return out;
  }
  out.setFound(true);
  out.setFullName(fullNameOf(type));
  out.setFieldsList(type.fieldsArray.map((f) => buildFieldInfo(f)));
  return out;
}
