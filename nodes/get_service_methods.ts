import { ServiceNameInput, GetServiceMethodsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, lookupService, buildMethodInfo, fullNameOf } from './lib';

/**
 * Looks up one service by simple or fully-qualified dotted name and
 * returns its RPC methods (name, resolved fully-qualified request/
 * response type, client/server streaming flags, method-level options).
 * found=false with a structured error if the schema fails to parse or no
 * such service exists.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getServiceMethods(ax: AxiomContext, input: ServiceNameInput): GetServiceMethodsResult {
  const out = new GetServiceMethodsResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setFound(false);
    out.setError(parsed.errors[0]?.getMessage() ?? 'schema failed to parse');
    return out;
  }
  const serviceName = input.getServiceName();
  const svc = lookupService(parsed.root, serviceName);
  if (!svc) {
    out.setFound(false);
    out.setError(`no service named "${serviceName}" found in schema`);
    return out;
  }
  out.setFound(true);
  out.setFullName(fullNameOf(svc));
  out.setMethodsList(svc.methodsArray.map((m) => buildMethodInfo(m)));
  return out;
}
