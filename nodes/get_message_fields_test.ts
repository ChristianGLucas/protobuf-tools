import { MessageNameInput, FieldInfo } from '../gen/messages_pb';
import { getMessageFields } from './get_message_fields';
import { ctx, PROTO3_SCHEMA, PROTO2_SCHEMA } from './testkit';

function byName(fields: FieldInfo[], name: string): FieldInfo {
  const f = fields.find((x) => x.getName() === name);
  if (!f) throw new Error(`field "${name}" not found`);
  return f;
}

describe('GetMessageFields', () => {
  it('extracts every field of Person with correct type/number/label/default/oneof/map shape', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('Person');
    const out = getMessageFields(ctx, input);

    expect(out.getFound()).toBe(true);
    expect(out.getFullName()).toBe('demo.v1.Person');
    const fields = out.getFieldsList();
    expect(fields).toHaveLength(9);

    const name = byName(fields, 'name');
    expect(name.getType()).toBe('string');
    expect(name.getNumber()).toBe(1);
    expect(name.getLabel()).toBe('');
    expect(name.getIsMap()).toBe(false);
    expect(name.getDefaultValue()).toBe('');
    expect(name.getExplicitDefault()).toBe(false);

    const age = byName(fields, 'age');
    expect(age.getType()).toBe('int32');
    expect(age.getDefaultValue()).toBe('0');

    const tags = byName(fields, 'tags');
    expect(tags.getLabel()).toBe('repeated');
    expect(tags.getNumber()).toBe(3);

    const address = byName(fields, 'address');
    expect(address.getType()).toBe('Address');
    // A message-typed field has no scalar default.
    expect(address.getDefaultValue()).toBe('');

    const role = byName(fields, 'role');
    expect(role.getType()).toBe('Role');
    // Implicit default of an enum field is its own zero-numbered value's name.
    expect(role.getDefaultValue()).toBe('ROLE_UNKNOWN');

    const scores = byName(fields, 'scores');
    expect(scores.getIsMap()).toBe(true);
    expect(scores.getMapKeyType()).toBe('string');
    expect(scores.getType()).toBe('int32');
    // A map field must NOT report a scalar zero-value default.
    expect(scores.getDefaultValue()).toBe('');

    const nickname = byName(fields, 'nickname');
    expect(nickname.getLabel()).toBe('optional');
    expect(nickname.getOneofName()).toBe('_nickname');

    const email = byName(fields, 'email');
    expect(email.getLabel()).toBe('optional');
    expect(email.getOneofName()).toBe('contact');

    const phone = byName(fields, 'phone');
    expect(phone.getOneofName()).toBe('contact');
  });

  it('reports proto2 required/optional labels and an explicit default', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO2_SCHEMA);
    input.setMessageName('Legacy');
    const out = getMessageFields(ctx, input);

    expect(out.getFound()).toBe(true);
    const fields = out.getFieldsList();

    const id = byName(fields, 'id');
    expect(id.getLabel()).toBe('required');

    const label = byName(fields, 'label');
    expect(label.getLabel()).toBe('optional');
    expect(label.getExplicitDefault()).toBe(true);
    expect(label.getDefaultValue()).toBe('unnamed');

    const items = byName(fields, 'items');
    expect(items.getLabel()).toBe('repeated');
  });

  it('resolves a fully-qualified nested message name', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('demo.v1.Person.Address');
    const out = getMessageFields(ctx, input);
    expect(out.getFound()).toBe(true);
    expect(out.getFullName()).toBe('demo.v1.Person.Address');
    expect(out.getFieldsList().map((f) => f.getName())).toEqual(['street', 'city']);
  });

  it('returns found=false with a structured error for a message that does not exist', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('NoSuchMessage');
    const out = getMessageFields(ctx, input);
    expect(out.getFound()).toBe(false);
    expect(out.getError()).toMatch(/no message named/);
  });
});
