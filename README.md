# protobuf-tools

Composable [Axiom](https://axiomide.com) nodes for deterministic parsing, validation, and
structural inspection of Protocol Buffers (`.proto`) schema definitions — proto2, proto3,
and editions — wrapping [protobufjs](https://github.com/protobufjs/protobuf.js)
(protobuf.js, BSD-3-Clause), the pure-JS reference `.proto` parser and reflection library.

Built for the Axiom marketplace (`christiangeorgelucas/protobuf-tools`).

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/protobuf-tools@0.1.1

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/protobuf-tools/ParseSchema --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/protobuf-tools/0.1.1/ParseSchema \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/protobuf-tools/ParseSchema`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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

Every node returns a structured, located error on malformed input (a syntax error, an
unresolved reference, corrupt wire bytes) instead of crashing.

## License

MIT — see [LICENSE](./LICENSE).
