import { SchemaInput } from '../gen/messages_pb';
import { listEnums } from './list_enums';
import { ctx, PROTO3_SCHEMA } from './testkit';

describe('ListEnums', () => {
  it('lists both a nested and a top-level enum with their values', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = listEnums(ctx, input);

    expect(out.getValid()).toBe(true);
    const names = out.getEnumsList().map((e) => e.getFullName());
    expect(names).toEqual(['demo.v1.Person.Role', 'demo.v1.Status']);

    const role = out.getEnumsList()[0];
    expect(role.getName()).toBe('Role');
    const roleValues = role.getValuesList().map((v) => [v.getName(), v.getNumber()]);
    expect(roleValues).toEqual([
      ['ROLE_UNKNOWN', 0],
      ['ROLE_ADMIN', 1],
      ['ROLE_MEMBER', 2],
    ]);

    const status = out.getEnumsList()[1];
    const statusValues = status.getValuesList().map((v) => [v.getName(), v.getNumber()]);
    expect(statusValues).toEqual([
      ['STATUS_UNKNOWN', 0],
      ['STATUS_ACTIVE', 1],
      ['STATUS_INACTIVE', 2],
    ]);
  });
});
