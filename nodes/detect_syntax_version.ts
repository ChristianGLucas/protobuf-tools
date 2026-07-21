import { SchemaInput, DetectSyntaxVersionResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSchemaText, detectSyntax } from './lib';

/**
 * Detects which syntax dialect a schema declares — "proto2", "proto3", an
 * edition string (e.g. "2023"), or "unspecified" when no syntax/edition
 * statement is present (the protobuf spec's own default: unspecified
 * means proto2 semantics). Also parses the schema to confirm it's at
 * least syntactically valid; a parse failure returns valid=false with the
 * structured error instead.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectSyntaxVersion(ax: AxiomContext, input: SchemaInput): DetectSyntaxVersionResult {
  const out = new DetectSyntaxVersionResult();
  const schema = input.getSchema();
  const parsed = parseSchemaText(schema);
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  const { syntax, declared } = detectSyntax(schema);
  out.setValid(true);
  out.setSyntax(syntax);
  out.setDeclared(declared);
  return out;
}
