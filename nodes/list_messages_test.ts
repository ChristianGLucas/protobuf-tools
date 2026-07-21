import { SchemaInput } from '../gen/messages_pb';
import { listMessages } from './list_messages';
import { ctx, PROTO3_SCHEMA, BROKEN_SCHEMA } from './testkit';

describe('ListMessages', () => {
  it('lists top-level and nested messages depth-first with nesting metadata', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = listMessages(ctx, input);

    expect(out.getValid()).toBe(true);
    const names = out.getMessagesList().map((m) => m.getFullName());
    expect(names).toEqual(['demo.v1.Person', 'demo.v1.Person.Address']);

    const person = out.getMessagesList()[0];
    expect(person.getName()).toBe('Person');
    expect(person.getNestedMessageNamesList()).toEqual(['Address']);
    expect(person.getNestedEnumNamesList()).toEqual(['Role']);
    expect(person.getFieldCount()).toBe(9);

    const address = out.getMessagesList()[1];
    expect(address.getName()).toBe('Address');
    expect(address.getNestedMessageNamesList()).toEqual([]);
    expect(address.getFieldCount()).toBe(2);
  });

  it('returns valid=false with a structured error for a broken schema', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = listMessages(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()).toHaveLength(1);
    expect(out.getMessagesList()).toHaveLength(0);
  });
});
