import { SchemaInput } from '../gen/messages_pb';
import { detectSyntaxVersion } from './detect_syntax_version';
import { ctx, PROTO3_SCHEMA, PROTO2_SCHEMA, NO_SYNTAX_SCHEMA, BROKEN_SCHEMA } from './testkit';

describe('DetectSyntaxVersion', () => {
  it('detects an explicit "proto3" declaration', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = detectSyntaxVersion(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getSyntax()).toBe('proto3');
    expect(out.getDeclared()).toBe(true);
  });

  it('detects an explicit "proto2" declaration', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO2_SCHEMA);
    const out = detectSyntaxVersion(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getSyntax()).toBe('proto2');
    expect(out.getDeclared()).toBe(true);
  });

  it('reports "unspecified" with declared=false when no syntax statement is present', () => {
    const input = new SchemaInput();
    input.setSchema(NO_SYNTAX_SCHEMA);
    const out = detectSyntaxVersion(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getSyntax()).toBe('unspecified');
    expect(out.getDeclared()).toBe(false);
  });

  it('returns valid=false with the structured error for a schema that fails to parse', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = detectSyntaxVersion(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()).toHaveLength(1);
    expect(out.getSyntax()).toBe('');
  });
});
