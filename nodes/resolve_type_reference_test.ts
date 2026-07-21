import { ResolveTypeReferenceInput } from '../gen/messages_pb';
import { resolveTypeReference } from './resolve_type_reference';
import { ctx, PROTO3_SCHEMA } from './testkit';

describe('ResolveTypeReference', () => {
  it('resolves a scalar keyword directly, without looking at the schema', () => {
    const input = new ResolveTypeReferenceInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setTypeName('int32');
    const out = resolveTypeReference(ctx, input);
    expect(out.getResolved()).toBe(true);
    expect(out.getKind()).toBe('scalar');
    expect(out.getFullyQualifiedName()).toBe('int32');
  });

  it('resolves a bare top-level message name from the package scope', () => {
    const input = new ResolveTypeReferenceInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setTypeName('Person');
    const out = resolveTypeReference(ctx, input);
    expect(out.getResolved()).toBe(true);
    expect(out.getKind()).toBe('message');
    expect(out.getFullyQualifiedName()).toBe('demo.v1.Person');
  });

  it('resolves a relative nested-type name from within its declaring message scope', () => {
    const input = new ResolveTypeReferenceInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setTypeName('Address');
    input.setContextMessage('demo.v1.Person');
    const out = resolveTypeReference(ctx, input);
    expect(out.getResolved()).toBe(true);
    expect(out.getKind()).toBe('message');
    expect(out.getFullyQualifiedName()).toBe('demo.v1.Person.Address');
  });

  it('resolves an absolute dotted enum reference', () => {
    const input = new ResolveTypeReferenceInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setTypeName('.demo.v1.Status');
    const out = resolveTypeReference(ctx, input);
    expect(out.getResolved()).toBe(true);
    expect(out.getKind()).toBe('enum');
    expect(out.getFullyQualifiedName()).toBe('demo.v1.Status');
  });

  it('returns resolved=false with kind="unknown" for a name that does not exist', () => {
    const input = new ResolveTypeReferenceInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setTypeName('NoSuchType');
    const out = resolveTypeReference(ctx, input);
    expect(out.getResolved()).toBe(false);
    expect(out.getKind()).toBe('unknown');
    expect(out.getError()).not.toBe('');
  });
});
