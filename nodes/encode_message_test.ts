import { EncodeMessageInput } from '../gen/messages_pb';
import * as protobuf from 'protobufjs';
import { encodeMessage } from './encode_message';
import { ctx, POINT_SCHEMA } from './testkit';

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
