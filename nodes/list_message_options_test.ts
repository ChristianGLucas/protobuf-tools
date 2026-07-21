import { MessageNameInput } from '../gen/messages_pb';
import { listMessageOptions } from './list_message_options';
import { ctx, PROTO3_SCHEMA, MESSAGE_OPTIONS_SCHEMA } from './testkit';

describe('ListMessageOptions', () => {
  it('lists a declared message-level option', () => {
    const input = new MessageNameInput();
    input.setSchema(MESSAGE_OPTIONS_SCHEMA);
    input.setMessageName('Deprecated');
    const out = listMessageOptions(ctx, input);

    expect(out.getFound()).toBe(true);
    expect(out.getOptionsList()).toHaveLength(1);
    expect(out.getOptionsList()[0].getName()).toBe('deprecated');
    expect(out.getOptionsList()[0].getValue()).toBe('true');
  });

  it('returns found=true with an empty list for a message with no options', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('Person');
    const out = listMessageOptions(ctx, input);
    expect(out.getFound()).toBe(true);
    expect(out.getOptionsList()).toHaveLength(0);
  });

  it('returns found=false with a structured error for a message that does not exist', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('NoSuchMessage');
    const out = listMessageOptions(ctx, input);
    expect(out.getFound()).toBe(false);
    expect(out.getError()).toMatch(/no message named/);
  });
});
