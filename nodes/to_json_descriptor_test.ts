import { SchemaInput } from '../gen/messages_pb';
import * as protobuf from 'protobufjs';
import { toJsonDescriptor } from './to_json_descriptor';
import { ctx, PROTO3_SCHEMA, BROKEN_SCHEMA } from './testkit';

describe('ToJsonDescriptor', () => {
  it('produces a JSON descriptor whose structure matches the schema by construction', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = toJsonDescriptor(ctx, input);

    expect(out.getValid()).toBe(true);
    const descriptor = JSON.parse(out.getDescriptorJson());
    const person = descriptor.nested.demo.nested.v1.nested.Person;
    expect(person.fields.name.type).toBe('string');
    expect(person.fields.age.id).toBe(2);
    expect(descriptor.nested.demo.nested.v1.nested.Status.values.STATUS_ACTIVE).toBe(1);
  });

  it('round-trips through protobufjs Root.fromJSON back into a usable reflection tree', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = toJsonDescriptor(ctx, input);
    const rebuilt = protobuf.Root.fromJSON(JSON.parse(out.getDescriptorJson()));
    const person = rebuilt.lookupType('demo.v1.Person');
    expect(person.fieldsArray.map((f) => f.name)).toContain('name');
  });

  it('returns valid=false with a structured error for a broken schema', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = toJsonDescriptor(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getDescriptorJson()).toBe('');
  });
});
