import { SchemaInput, ListFileOptionsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, buildOptionEntries, getFileOptions } from './lib';

/**
 * Lists every top-level (file-scope) `option name = value;` statement
 * declared in a schema — e.g. java_package, go_package, optimize_for — as
 * (name, stringified-value) pairs. Does not include message/field/
 * service/method-scoped options; see ListMessageOptions for a message's
 * own options.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listFileOptions(ax: AxiomContext, input: SchemaInput): ListFileOptionsResult {
  const out = new ListFileOptionsResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setOptionsList(buildOptionEntries(getFileOptions(parsed.root, parsed.pkg)));
  return out;
}
