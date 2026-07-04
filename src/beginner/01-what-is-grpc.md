---
title: 01 What is gRPC
---

# 01 What is gRPC

gRPC is a contract-first RPC framework from Google. You define messages and
services in a `.proto` file, and gRPC handles serialization (Protocol Buffers)
and transport (HTTP/2) for you. Both client and server agree on the contract
before any code runs — no guessing at JSON shapes.

Key properties:
- **Contract-first** — `.proto` is the source of truth.
- **Strongly typed** — fields have explicit scalar or message types.
- **HTTP/2** — multiplexed, binary, low-latency.
- **Polyglot** — the same `.proto` generates stubs for Go, Java, Python, Node, and more.

In this tier you stay in Node.js and skip code generation entirely: the
`@grpc/proto-loader` package loads the `.proto` at runtime.

## Set up the project

```bash
mkdir greeter && cd greeter
npm init -y
npm install @grpc/grpc-js @grpc/proto-loader
```

You'll work with three files: `greeter.proto`, `server.js`, and `client.js`
(plus the shared `load.js` helper). Nothing else is needed.

Next: [02 Define the proto](./02-define-proto.md)
