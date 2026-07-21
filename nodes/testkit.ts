// Shared test context + fixture .proto schemas for protobuf-tools node unit
// tests. Not a node and not a test file (no describe/it), so it is neither
// registered as a node nor collected by jest (see jest.config.js testMatch).
import {
  AxiomContext,
  AxiomLogger,
  AxiomSecrets,
  AxiomReflection,
  AxiomMutation,
} from '../gen/axiomContext';

const reflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const mutation: AxiomMutation = {
  flow: {
    addNode: (_p: string, _v: string) => 0,
    addEdge: (_s: number, _d: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection,
  mutation,
};

// A hand-written, syntactically valid proto3 schema exercising every
// structural feature the inspection nodes read: a package, an import
// (deliberately never resolved), file-level options, a top-level message
// with a nested message + nested enum, every field kind (scalar, message
// reference, repeated, map, oneof, explicit `optional`), reserved
// ranges/names with no conflict, a top-level enum, and a service with one
// unary and one bidirectional-streaming RPC. Every field's presence/value
// here is independently known by construction (this file), which is the
// oracle every test below checks its node's output against.
export const PROTO3_SCHEMA = `
syntax = "proto3";

package demo.v1;

import "google/protobuf/timestamp.proto";

option java_package = "com.demo.v1";
option go_package = "demo/v1;demov1";

// A person record.
message Person {
  message Address {
    string street = 1;
    string city = 2;
  }

  enum Role {
    ROLE_UNKNOWN = 0;
    ROLE_ADMIN = 1;
    ROLE_MEMBER = 2;
  }

  string name = 1;
  int32 age = 2;
  repeated string tags = 3;
  Address address = 4;
  Role role = 5;
  map<string, int32> scores = 6;
  optional string nickname = 7;

  oneof contact {
    string email = 8;
    string phone = 9;
  }

  reserved 10, 11 to 13;
  reserved "legacy_field";
}

enum Status {
  STATUS_UNKNOWN = 0;
  STATUS_ACTIVE = 1;
  STATUS_INACTIVE = 2;
}

service PersonService {
  rpc GetPerson (Person) returns (Person);
  rpc StreamPeople (stream Person) returns (stream Person);
}
`;

// A minimal proto2 schema, used to check proto2-specific semantics:
// required/optional labels and an explicit [default = ...].
export const PROTO2_SCHEMA = `
syntax = "proto2";

message Legacy {
  required string id = 1;
  optional string label = 2 [default = "unnamed"];
  optional int32 count = 3;
  repeated string items = 4;
}
`;

// A schema with no syntax statement at all — per the protobuf spec this
// defaults to proto2 semantics; used to check DetectSyntaxVersion's
// "unspecified" / declared=false path.
export const NO_SYNTAX_SCHEMA = `
message Bare {
  optional string x = 1;
}
`;

// Syntactically broken (missing ';') — used to check every node's
// structured-error path.
export const BROKEN_SCHEMA = `
syntax = "proto3";
message Broken {
  string name = 1
}
`;

// A schema whose field references a message type that is never defined —
// parses fine (protobufjs's parser doesn't check references), but fails
// ValidateSchema's resolveAll() pass.
export const UNRESOLVED_REF_SCHEMA = `
syntax = "proto3";
message A {
  B b = 1;
}
`;

// A message where a field is declared BEFORE the reserved statement that
// marks its own number/name — protobufjs's parser only rejects this the
// other way around (reserved-before-field), so this parses successfully
// and is the case ListFieldNumbers must still catch.
export const RESERVED_CONFLICT_SCHEMA = `
syntax = "proto3";
message Conflicted {
  string a = 5;
  string b = 9;
  reserved 5;
  reserved "b";
}
`;

export const POINT_SCHEMA = `
syntax = "proto3";
message Point {
  float x = 1;
  float y = 2;
  repeated string tags = 3;
}
`;

// A message with a message-level option, used to check ListMessageOptions.
export const MESSAGE_OPTIONS_SCHEMA = `
syntax = "proto3";
message Deprecated {
  option deprecated = true;
  string x = 1;
}
`;

// A schema exceeding MAX_SCHEMA_BYTES (1,000,000 bytes) — a single huge
// comment, so it stays otherwise-valid .proto text and the size check is
// what actually rejects it.
export const OVERSIZED_SCHEMA = `syntax = "proto3";\n// ${'x'.repeat(1_000_001)}\nmessage M { string a = 1; }\n`;

// A schema exceeding MAX_NESTING_DEPTH (60) brace-nesting levels — 70
// nested empty message blocks. Used to prove the pre-parse depth guard
// rejects it before it ever reaches protobufjs's recursive-descent parser
// (which would otherwise be the thing at risk of a stack overflow).
export const DEEPLY_NESTED_SCHEMA =
  'syntax = "proto3";\n' +
  Array.from({ length: 70 }, (_, i) => `message M${i} {`).join('\n') +
  '\nstring leaf = 1;\n' +
  '}'.repeat(70) +
  '\n';
