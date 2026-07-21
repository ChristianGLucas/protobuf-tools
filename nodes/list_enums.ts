import { SchemaInput, ListEnumsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, walkEnums } from './lib';

/**
 * Lists every enum type defined in a schema, top-level and nested, each
 * with its simple name, fully-qualified dotted name, and every
 * (name, number) value pair in declaration order.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listEnums(ax: AxiomContext, input: SchemaInput): ListEnumsResult {
  const out = new ListEnumsResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setEnumsList(walkEnums(parsed.root));
  return out;
}
