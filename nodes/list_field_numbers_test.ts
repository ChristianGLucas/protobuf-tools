import { MessageNameInput } from '../gen/messages_pb';
import { listFieldNumbers } from './list_field_numbers';
import { ctx, PROTO3_SCHEMA, RESERVED_CONFLICT_SCHEMA } from './testkit';

describe('ListFieldNumbers', () => {
  it('lists field numbers and reserved ranges/names with no conflicts for a clean message', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('Person');
    const out = listFieldNumbers(ctx, input);

    expect(out.getFound()).toBe(true);
    expect(out.getFieldsList().map((f) => [f.getName(), f.getNumber()])).toEqual([
      ['name', 1], ['age', 2], ['tags', 3], ['address', 4], ['role', 5],
      ['scores', 6], ['nickname', 7], ['email', 8], ['phone', 9],
    ]);

    const ranges = out.getReservedRangesList().map((r) => [r.getStart(), r.getEnd()]);
    expect(ranges).toEqual([[10, 10], [11, 13]]);
    expect(out.getReservedNamesList()).toEqual(['legacy_field']);

    expect(out.getHasConflicts()).toBe(false);
    expect(out.getConflictingNumbersList()).toEqual([]);
    expect(out.getConflictingNamesList()).toEqual([]);
  });

  it('detects a field-number/reserved-range conflict protobufjs itself misses (field declared before the reserved statement)', () => {
    const input = new MessageNameInput();
    input.setSchema(RESERVED_CONFLICT_SCHEMA);
    input.setMessageName('Conflicted');
    const out = listFieldNumbers(ctx, input);

    expect(out.getFound()).toBe(true);
    expect(out.getHasConflicts()).toBe(true);
    expect(out.getConflictingNumbersList()).toEqual([5]);
    expect(out.getConflictingNamesList()).toEqual(['b']);
  });

  it('returns found=false with a structured error for a message that does not exist', () => {
    const input = new MessageNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setMessageName('NoSuchMessage');
    const out = listFieldNumbers(ctx, input);
    expect(out.getFound()).toBe(false);
  });
});
