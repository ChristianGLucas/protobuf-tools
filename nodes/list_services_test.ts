import { SchemaInput } from '../gen/messages_pb';
import { listServices } from './list_services';
import { ctx, PROTO3_SCHEMA } from './testkit';

describe('ListServices', () => {
  it('lists the service with its unary and bidi-streaming methods', () => {
    const input = new SchemaInput();
    input.setSchema(PROTO3_SCHEMA);
    const out = listServices(ctx, input);

    expect(out.getValid()).toBe(true);
    expect(out.getServicesList()).toHaveLength(1);
    const svc = out.getServicesList()[0];
    expect(svc.getFullName()).toBe('demo.v1.PersonService');

    const methods = svc.getMethodsList();
    expect(methods.map((m) => m.getName())).toEqual(['GetPerson', 'StreamPeople']);

    const getPerson = methods[0];
    expect(getPerson.getInputType()).toBe('demo.v1.Person');
    expect(getPerson.getOutputType()).toBe('demo.v1.Person');
    expect(getPerson.getClientStreaming()).toBe(false);
    expect(getPerson.getServerStreaming()).toBe(false);

    const streamPeople = methods[1];
    expect(streamPeople.getClientStreaming()).toBe(true);
    expect(streamPeople.getServerStreaming()).toBe(true);
    expect(streamPeople.getInputType()).toBe('demo.v1.Person');
  });
});
