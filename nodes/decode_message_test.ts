import { DecodeMessageInput } from '../gen/messages_pb';
import * as protobuf from 'protobufjs';
import { decodeMessage } from './decode_message';
import { ctx, POINT_SCHEMA } from './testkit';

describe('DecodeMessage', () => {
  it('decodes wire bytes (produced independently by protobufjs itself) back to the correct JSON value', () => {
    // Independent oracle: encode with protobufjs directly (not through our
    // own EncodeMessage node) so the input bytes are known-correct by
    // construction, then check our node decodes them back faithfully.
    const root = protobuf.parse(POINT_SCHEMA, new protobuf.Root(), { keepCase: true }).root;
    const Point = root.lookupType('Point');
    const message = Point.fromObject({ x: 3.25, y: -1.5, tags: ['p', 'q'] });
    const bytes = Point.encode(message).finish();

    const input = new DecodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setWireBytesBase64(Buffer.from(bytes).toString('base64'));
    const out = decodeMessage(ctx, input);

    expect(out.getOk()).toBe(true);
    const value = JSON.parse(out.getJsonValue());
    expect(value.x).toBeCloseTo(3.25);
    expect(value.y).toBeCloseTo(-1.5);
    expect(value.tags).toEqual(['p', 'q']);
  });

  it('returns ok=false with a structured error for corrupt wire bytes instead of throwing', () => {
    const input = new DecodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setWireBytesBase64(Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).toString('base64'));
    const out = decodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).not.toBe('');
    expect(out.getJsonValue()).toBe('');
  });

  it('returns ok=false for a message name that does not exist in the schema', () => {
    const input = new DecodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('NoSuchMessage');
    input.setWireBytesBase64('');
    const out = decodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/no message named/);
  });

  it('rejects an oversized wire_bytes_base64 before attempting to decode it', () => {
    const input = new DecodeMessageInput();
    input.setSchema(POINT_SCHEMA);
    input.setMessageName('Point');
    input.setWireBytesBase64('A'.repeat(3 * 1024 * 1024 + 1));
    const out = decodeMessage(ctx, input);
    expect(out.getOk()).toBe(false);
    expect(out.getError()).toMatch(/exceeds/);
  });
});
