import { SchemaInput, ValidateSchemaResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validateSchemaText } from './lib';

/**
 * Parses a schema and then runs protobufjs's full reference resolution
 * (`Root#resolveAll`) over it: every field/method type reference must
 * resolve to a real message or enum in the schema. Returns valid=true, or
 * valid=false with a structured error — a syntax error (with line
 * location) if the schema doesn't even parse, or an unresolved-reference
 * error (no line location; protobufjs's resolver does not track one)
 * otherwise.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateSchema(ax: AxiomContext, input: SchemaInput): ValidateSchemaResult {
  const out = new ValidateSchemaResult();
  const { valid, errors } = validateSchemaText(input.getSchema());
  out.setValid(valid);
  out.setErrorsList(errors);
  return out;
}
