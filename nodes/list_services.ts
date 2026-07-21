import { SchemaInput, ListServicesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, walkServices } from './lib';

/**
 * Lists every gRPC service defined in a schema, each with its
 * fully-qualified name and every RPC method it declares (name, resolved
 * fully-qualified request/response type, client/server streaming flags).
 * Use GetServiceMethods to look up one service by name directly.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listServices(ax: AxiomContext, input: SchemaInput): ListServicesResult {
  const out = new ListServicesResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setServicesList(walkServices(parsed.root));
  return out;
}
