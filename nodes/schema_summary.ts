import { SchemaInput, SchemaSummaryResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, detectSyntax, walkMessages, walkEnums, walkServices } from './lib';

/**
 * Reports coarse counts for a schema in one call — package, syntax
 * dialect, and the total number of messages (top-level + nested), enums
 * (top-level + nested), services, and RPC methods across all services.
 * valid=false with the structured parse error if the schema doesn't
 * parse.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function schemaSummary(ax: AxiomContext, input: SchemaInput): SchemaSummaryResult {
  const out = new SchemaSummaryResult();
  const schema = input.getSchema();
  const parsed = parseSchemaText(schema);
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  const services = walkServices(parsed.root);
  out.setValid(true);
  out.setPackage(parsed.pkg);
  out.setSyntax(detectSyntax(schema).syntax);
  out.setMessageCount(walkMessages(parsed.root).length);
  out.setEnumCount(walkEnums(parsed.root).length);
  out.setServiceCount(services.length);
  out.setMethodCount(services.reduce((sum, s) => sum + s.getMethodsList().length, 0));
  return out;
}
