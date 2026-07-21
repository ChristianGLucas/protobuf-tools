import { MessageNameInput, ListFieldNumbersResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, buildFieldInfo, buildReservedRanges, findReservedConflicts } from './lib';

/**
 * Looks up one message and returns every field it declares (name, number,
 * and full FieldInfo) alongside its `reserved` ranges and reserved names,
 * plus any field whose number falls in a reserved range or whose name
 * matches a reserved name — computed independently of declaration order.
 * protobufjs's own parser rejects this conflict at parse time only when
 * the field is declared AFTER the `reserved` statement; a field declared
 * BEFORE a later `reserved` statement marking its own number/name parses
 * successfully but is a real conflict, which this node still surfaces via
 * conflicting_numbers/conflicting_names/has_conflicts.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listFieldNumbers(ax: AxiomContext, input: MessageNameInput): ListFieldNumbersResult {
  const out = new ListFieldNumbersResult();
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
  out.setFieldsList(type.fieldsArray.map((f) => buildFieldInfo(f)));
  const { ranges, names } = buildReservedRanges(type.reserved);
  out.setReservedRangesList(ranges);
  out.setReservedNamesList(names);
  const conflicts = findReservedConflicts(type);
  out.setConflictingNumbersList(conflicts.numbers);
  out.setConflictingNamesList(conflicts.names);
  out.setHasConflicts(conflicts.numbers.length > 0 || conflicts.names.length > 0);
  return out;
}
