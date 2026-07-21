import { SchemaInput, GetPackageInfoResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, detectSyntax } from './lib';

/**
 * Extracts a schema's `package` declaration (empty string if none), every
 * `import` path exactly as written (never fetched or resolved — a
 * schema's imports are always reported, never followed), and its detected
 * syntax dialect, in one call.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getPackageInfo(ax: AxiomContext, input: SchemaInput): GetPackageInfoResult {
  const out = new GetPackageInfoResult();
  const schema = input.getSchema();
  const parsed = parseSchemaText(schema);
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setPackage(parsed.pkg);
  out.setImportsList(parsed.imports);
  out.setSyntax(detectSyntax(schema).syntax);
  return out;
}
