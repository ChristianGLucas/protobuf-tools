import { SchemaInput } from '../gen/messages_pb';
import { parseSchema } from './parse_schema';
import { ctx, PROTO3_SCHEMA, BROKEN_SCHEMA } from './testkit';

describe('ParseSchema', () => {
  it('parses a full proto3 schema into packages/messages/enums/services/options', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = parseSchema(ctx, input);

    expect(out.getValid()).toBe(true);
    expect(out.getErrorsList()).toHaveLength(0);
    expect(out.getSyntax()).toBe('proto3');
    expect(out.getPackage()).toBe('demo.v1');
    expect(out.getImportsList()).toEqual(['google/protobuf/timestamp.proto']);

    const messageNames = out.getMessagesList().map((m) => m.getFullName());
    expect(messageNames).toEqual(['demo.v1.Person', 'demo.v1.Person.Address']);
    const person = out.getMessagesList()[0];
    expect(person.getNestedMessageNamesList()).toEqual(['Address']);
    expect(person.getNestedEnumNamesList()).toEqual(['Role']);
    expect(person.getFieldCount()).toBe(9);

    const enumNames = out.getEnumsList().map((e) => e.getFullName());
    expect(enumNames).toEqual(['demo.v1.Person.Role', 'demo.v1.Status']);

    expect(out.getServicesList()).toHaveLength(1);
    const svc = out.getServicesList()[0];
    expect(svc.getFullName()).toBe('demo.v1.PersonService');
    expect(svc.getMethodsList().map((m) => m.getName())).toEqual(['GetPerson', 'StreamPeople']);

    const optNames = out.getFileOptionsList().map((o) => o.getName()).sort();
    expect(optNames).toEqual(['go_package', 'java_package']);
    const javaPkg = out.getFileOptionsList().find((o) => o.getName() === 'java_package');
    expect(javaPkg?.getValue()).toBe('com.demo.v1');
  });

  it('returns a structured, line-located error for a syntactically broken schema', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = parseSchema(ctx, input);

    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()).toHaveLength(1);
    const err = out.getErrorsList()[0];
    expect(err.getMessage()).toMatch(/';' expected/);
    expect(err.getLocation()?.getLine()).toBe(5);
    expect(out.getMessagesList()).toHaveLength(0);
  });
});
