import { MessageNameInput, ListMessageOptionsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupMessage, buildOptionEntries } from './lib';

/**
 * Looks up one message by name and lists the options declared directly on
 * it (e.g. `option deprecated = true;`) as (name, stringified-value)
 * pairs. found=false with a structured error if the schema fails to parse
 * or no such message exists (an existing message with zero declared
 * options returns found=true with an empty list).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listMessageOptions(ax: AxiomContext, input: MessageNameInput): ListMessageOptionsResult {
  const out = new ListMessageOptionsResult();
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
  out.setOptionsList(buildOptionEntries(type.options as Record<string, unknown> | undefined));
  return out;
}
