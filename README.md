# protobuf-tools

Composable [Axiom](https://axiom.co) nodes for deterministic parsing, validation, and
structural inspection of Protocol Buffers (`.proto`) schema definitions — proto2, proto3,
and editions — wrapping [protobufjs](https://github.com/protobufjs/protobuf.js)
(protobuf.js, BSD-3-Clause), the pure-JS reference `.proto` parser and reflection library.

Built for the Axiom marketplace (`christiangeorgelucas/protobuf-tools`).

## What it does

The `.proto` schema is always supplied as text by the caller. No node ever fetches an
`import`, resolves one over the network, or reaches the filesystem — declared imports are
always reported back as literal, unresolved strings. Every node is a pure, deterministic,
single-input -> single-output transform: no wall-clock use, no randomness, no persistent
state.

17 nodes cover the schema-inspection surface broadly:

- **ParseSchema** — full structural parse (packages, messages, enums, services, options, imports)
- **ValidateSchema** — full semantic reference resolution (every type reference must resolve)
- **DetectSyntaxVersion** — proto2 / proto3 / edition / unspecified
- **ListMessages** — every message type, top-level and nested, depth-first
- **GetMessageFields** — one message's fields (name, type, number, label, default, oneof, map shape)
- **ListEnums** — every enum type and its values
- **ListServices** — every gRPC service and its RPC methods (streaming flags included)
- **GetServiceMethods** — one service's methods
- **ListFileOptions** / **ListMessageOptions** — file-level and message-level options
- **GetPackageInfo** — package name, imports, syntax
- **ResolveTypeReference** — scope-aware type-reference resolution to a fully-qualified name
- **ListFieldNumbers** — field-number usage plus reserved-range/name conflict detection
  (independent of declaration order — protobufjs's own parser only catches one direction)
- **ToJsonDescriptor** — convert a parsed schema to protobufjs's JSON descriptor representation
- **SchemaSummary** — message/enum/service/method counts
- **EncodeMessage** / **DecodeMessage** — schema-driven JSON <-> protobuf wire-byte conversion

Every node bounds input size and brace-nesting depth up front and returns a structured,
located error on malformed input instead of crashing. Wire-format payloads are capped well
under Axiom's ~4 MiB node-transport limit.

## License

MIT — see [LICENSE](./LICENSE).
