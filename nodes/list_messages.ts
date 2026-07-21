import { SchemaInput, ListMessagesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, walkMessages } from './lib';

/**
 * Lists every message type defined in a schema, top-level and nested,
 * depth-first in declaration order — each with its simple name,
 * fully-qualified dotted name, direct nested-message/enum simple names,
 * and field count. A flat summary list, not a recursive tree; use
 * GetMessageFields for one message's actual field definitions.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listMessages(ax: AxiomContext, input: SchemaInput): ListMessagesResult {
  const out = new ListMessagesResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setMessagesList(walkMessages(parsed.root));
  return out;
}
