import { SchemaInput } from '../gen/messages_pb';
import { schemaSummary } from './schema_summary';
import { ctx, PROTO3_SCHEMA, BROKEN_SCHEMA } from './testkit';

describe('SchemaSummary', () => {
  it('counts messages/enums/services/methods correctly (nested included)', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = schemaSummary(ctx, input);

    expect(out.getValid()).toBe(true);
    expect(out.getPackage()).toBe('demo.v1');
    expect(out.getSyntax()).toBe('proto3');
    // Person + Person.Address
    expect(out.getMessageCount()).toBe(2);
    // Person.Role + Status
    expect(out.getEnumCount()).toBe(2);
    expect(out.getServiceCount()).toBe(1);
    // GetPerson + StreamPeople
    expect(out.getMethodCount()).toBe(2);
  });

  it('returns valid=false with the structured error for a broken schema', () => {
    const input = new SchemaInput();
    input.setSchema(BROKEN_SCHEMA);
    const out = schemaSummary(ctx, input);
    expect(out.getValid()).toBe(false);
    expect(out.getErrorsList()).toHaveLength(1);
    expect(out.getMessageCount()).toBe(0);
  });
});
