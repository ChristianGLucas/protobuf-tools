import { ServiceNameInput } from '../gen/messages_pb';
import { getServiceMethods } from './get_service_methods';
import { ctx, PROTO3_SCHEMA } from './testkit';

describe('GetServiceMethods', () => {
  it('looks up a service by simple name and returns its methods', () => {
    const input = new ServiceNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setServiceName('PersonService');
    const out = getServiceMethods(ctx, input);

    expect(out.getFound()).toBe(true);
    expect(out.getFullName()).toBe('demo.v1.PersonService');
    expect(out.getMethodsList().map((m) => m.getName())).toEqual(['GetPerson', 'StreamPeople']);
  });

  it('looks up a service by fully-qualified name', () => {
    const input = new ServiceNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setServiceName('demo.v1.PersonService');
    const out = getServiceMethods(ctx, input);
    expect(out.getFound()).toBe(true);
    expect(out.getMethodsList()).toHaveLength(2);
  });

  it('returns found=false with a structured error for a service that does not exist', () => {
    const input = new ServiceNameInput();
    input.setSchema(PROTO3_SCHEMA);
    input.setServiceName('NoSuchService');
    const out = getServiceMethods(ctx, input);
    expect(out.getFound()).toBe(false);
    expect(out.getError()).toMatch(/no service named/);
  });
});
