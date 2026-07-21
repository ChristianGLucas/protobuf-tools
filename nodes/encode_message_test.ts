import { EncodeMessageInput } from '../gen/messages_pb';
import * as protobuf from 'protobufjs';
import { encodeMessage } from './encode_message';
import { ctx, POINT_SCHEMA, ENUM_ROUND_TRIP_SCHEMA } from './testkit';

describe('EncodeMessage', () => {
  it('encodes a valid JSON value to wire bytes that protobufjs itself decodes back correctly', () => {
    const input = new EncodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setJsonValue(JSON.stringify({ x: 1.5, y: 2.5, tags: ['a', 'b'] }));
    const out = encodeMessage(ctx, input);

    expect(out.getOk()).toBe(true);
    expect(out.getError()).toBe('');
    expect(out.getByteLength()).toBeGreaterThan(0);

    // Independent oracle: decode the produced bytes with protobufjs
    // directly (not through our own DecodeMessage node) and check the
    // values round-tripped correctly.
    const root = protobuf.parse(POINT_SCHEMA, new protobuf.Root(), { keepCase: true }).root;
    const Point = root.lookupType('Point');
    const bytes = Buffer.from(out.getWireBytesBase64(), 'base64');
    const decoded = Point.toObject(Point.decode(bytes));
    expect(decoded.x).toBeCloseTo(1.5);
    expect(decoded.y).toBeCloseTo(2.5);
    expect(decoded.tags).toEqual(['a', 'b']);
  });

  it('rejects a wrong-typed field via verify() instead of silently encoding a coerced value', () => {
    const input = new EncodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setJsonValue(JSON.stringify({ x: 'not-a-number' }));
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/number expected/);
    expect(out.getWireBytesBase64()).toBe('');
  });

  it('rejects invalid JSON in json_value', () => {
    const input = new EncodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setJsonValue('{not json');
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/not valid JSON/);
  });

  it('returns ok=false for a message name that does not exist in the schema', () => {
    const input = new EncodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('NoSuchMessage');
    input.setJsonValue('{}');
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/no message named/);
  });

  it('accepts an enum field given by member name (matching what DecodeMessage/GetMessageFields report), at top level, nested one message deep, and inside a repeated field', () => {
    // Regression: Type#verify() rejects a valid enum member-name string
    // outright even though Type#fromObject() accepts it fine — found by
    // an independent adversarial review, since round-tripping
    // DecodeMessage's own enum-as-name output back through EncodeMessage
    // failed before this fix (see normalizeEnumFieldNames in nodes/lib.ts).
    const input = new EncodeMessageInput();
    input.setSchema(ENUM_ROUND_TRIP_SCHEMA);
    input.setMessageName('Outer');
    input.setJsonValue(JSON.stringify({
      role: 'ROLE_ADMIN',
      inner: { role: 'ROLE_ADMIN' },
      roles: ['ROLE_UNKNOWN', 'ROLE_ADMIN'],
    }));
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(true);
    expect(out.getError()).toBe('');

    // Independent oracle: decode with protobufjs directly and confirm the
    // name strings resolved to the correct numeric values on the wire.
    const root = protobuf.parse(ENUM_ROUND_TRIP_SCHEMA, new protobuf.Root(), { keepCase: true }).root;
    root.resolveAll();
    const Outer = root.lookupType('Outer');
    const bytes = Buffer.from(out.getWireBytesBase64(), 'base64');
    const decoded = Outer.toObject(Outer.decode(bytes), { enums: Number });
    expect(decoded.role).toBe(1);
    expect(decoded.inner.role).toBe(1);
    expect(decoded.roles).toEqual([0, 1]);
  });

  it('still rejects a genuinely unrecognized enum member name', () => {
    const input = new EncodeMessageInput();
    input.setSchema(ENUM_ROUND_TRIP_SCHEMA);
    input.setMessageName('Outer');
    input.setJsonValue(JSON.stringify({ role: 'NOT_A_REAL_MEMBER' }));
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/enum value expected/);
  });

  it('still accepts an enum field given by its numeric id', () => {
    const input = new EncodeMessageInput();
    input.setSchema(ENUM_ROUND_TRIP_SCHEMA);
    input.setMessageName('Outer');
    input.setJsonValue(JSON.stringify({ role: 1 }));
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(true);
  });

  it('rejects an oversized json_value before attempting to parse or encode it', () => {
    const input = new EncodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setJsonValue('x'.repeat(3 * 1024 * 1024 + 1));
    const out = encodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/exceeds/);
  });
});
