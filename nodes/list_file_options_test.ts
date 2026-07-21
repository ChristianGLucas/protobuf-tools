import { SchemaInput } from '../gen/messages_pb';
import { listFileOptions } from './list_file_options';
import { ctx, PROTO3_SCHEMA } from './testkit';

describe('ListFileOptions', () => {
  it('lists both top-level options for a schema that declares a package', () => {
    // Regression coverage: a file-level option attaches to the PACKAGE
    // namespace object, not the parser's root, whenever a `package`
    // statement is present — a naive `root.options` read would silently
    // return nothing here.
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = listFileOptions(ctx, input);

    expect(out.getValid()).toBe(true);
    const byName = new Map(out.getOptionsList().map((o) => [o.getName(), o.getValue()]));
    expect(byName.get('java_package')).toBe('com.demo.v1');
    expect(byName.get('go_package')).toBe('demo/v1;demov1');
    expect(out.getOptionsList()).toHaveLength(2);
  });

  it('lists a top-level option for a schema with no package statement', () => {
    const input = new SchemaInput();
    input.setSchema('syntax = "proto3";\noption java_package = "x.y";\nmessage M { string a = 1; }\n');
    const out = listFileOptions(ctx, input);
    expect(out.getValid()).toBe(true);
    expect(out.getOptionsList()).toHaveLength(1);
    expect(out.getOptionsList()[0].getName()).toBe('java_package');
    expect(out.getOptionsList()[0].getValue()).toBe('x.y');
  });
});
