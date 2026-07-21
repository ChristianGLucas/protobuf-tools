import { SchemaInput, ParseSchemaResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseSchemaText,
  detectSyntax,
  buildOptionEntries,
  getFileOptions,
  walkMessages,
  walkEnums,
  walkServices,
} from './lib';

/**
 * Fully parses a .proto schema string with protobufjs's own parser,
 * returning every package/imports/syntax declaration plus every message,
 * enum, service, and file-level option found, in declaration order. A
 * malformed schema returns valid=false with a structured, line-located
 * syntax error instead of throwing — protobufjs stops at the first syntax
 * error, so errors is normally a single-element list. This is a syntactic
 * parse only (it does not check that referenced types resolve); use
 * ValidateSchema for full semantic well-formedness.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseSchema(ax: AxiomContext, input: SchemaInput): ParseSchemaResult {
  const out = new ParseSchemaResult();
  const parsed = parseSchemaText(input.getSchema());
  if (!parsed.root) {
    out.setValid(false);
    out.setErrorsList(parsed.errors);
    return out;
  }
  out.setValid(true);
  out.setSyntax(detectSyntax(input.getSchema()).syntax);
  out.setPackage(parsed.pkg);
  out.setImportsList(parsed.imports);
  out.setMessagesList(walkMessages(parsed.root));
  out.setEnumsList(walkEnums(parsed.root));
  out.setServicesList(walkServices(parsed.root));
  out.setFileOptionsList(buildOptionEntries(getFileOptions(parsed.root, parsed.pkg)));
  return out;
}
