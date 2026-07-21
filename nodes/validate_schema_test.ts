import { SchemaInput } from '../gen/messages_pb';
import { validateSchema } from './validate_schema';
import { ctx, PROTO3_SCHEMA, BROKEN_SCHEMA, UNRESOLVED_REF_SCHEMA } from './testkit';

describe('ValidateSchema', () => {
  it('reports valid=true for a fully self-consistent schema', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = validateSchema(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getErrorsList()).toHaveLength(0);
  });

  it('reports the line-located syntax error for a schema that does not even parse', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = validateSchema(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()[0].getLocation()?.getLine()).toBe(5);
  });

  it('reports an unresolved-reference error for a schema that parses but does not resolve', () => {
    const input = new SchemaInput();
    input.setSchema(UNRESOLVED_REF_SCHEMA);
    const out = validateSchema(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()).toHaveLength(1);
    expect(out.getErrorsList()[0].getMessage()).toMatch(/no such Type or Enum 'B'/);
  });
});
