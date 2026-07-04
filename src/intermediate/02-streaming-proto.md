---
title: 02 The streaming proto
---

# 02 The streaming proto

Open `greeter.proto` from the beginner tier and add the `SayHellos` method.
The keyword `stream` before the return type marks it as server-streaming.

```proto
syntax = "proto3";

package greeter;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
  rpc SayHellos (HelloRequest) returns (stream HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

## What changed

| Before | After |
|---|---|
| One `SayHello` RPC | `SayHello` + `SayHellos` |
| `returns (HelloReply)` | `returns (stream HelloReply)` |

The `stream` keyword is the only proto change. The message types are identical —
`SayHellos` reuses `HelloRequest` and `HelloReply`. No other file needs to change
for the proto definition.

Because `@grpc/proto-loader` loads the `.proto` at runtime, no code-generation
step is needed. The server and client pick up the new method as soon as they
`require('./load')`.

Next: [03 The streaming server](./03-streaming-server.md)
