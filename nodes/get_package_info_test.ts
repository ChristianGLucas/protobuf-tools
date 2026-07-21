import { SchemaInput } from '../gen/messages_pb';
import { getPackageInfo } from './get_package_info';
import { ctx, PROTO3_SCHEMA, NO_SYNTAX_SCHEMA } from './testkit';

describe('GetPackageInfo', () => {
  it('extracts package, imports (unresolved), and syntax in one call', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = getPackageInfo(ctx, input);

    expect(out.getValid()).toBe(true);
    expect(out.getPackage()).toBe('demo.v1');
    expect(out.getImportsList()).toEqual(['google/protobuf/timestamp.proto']);
    expect(out.getSyntax()).toBe('proto3');
  });

  it('returns an empty package string and unspecified syntax when neither is declared', () => {
    const input = new SchemaInput();
    input.setSchema(NO_SYNTAX_SCHEMA);
    const out = getPackageInfo(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getPackage()).toBe('');
    expect(out.getImportsList()).toEqual([]);
    expect(out.getSyntax()).toBe('unspecified');
  });
});
