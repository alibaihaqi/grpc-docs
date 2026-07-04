---
title: 02 Define the proto
---

# 02 Define the proto

Create `greeter.proto` at the root of your project:

```proto
// greeter.proto
syntax = "proto3";

package greeter;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

What each part does:

| Part | Purpose |
|------|---------|
| `syntax = "proto3"` | Use the modern proto3 dialect (required fields removed, defaults are zero-values). |
| `package greeter` | Namespace — you'll reference it as `proto.Greeter` after loading. |
| `service Greeter` | Declares the RPC service with one unary method. |
| `rpc SayHello` | A unary call: one request, one response. |
| `HelloRequest` | Carries a single `name` string (field number 1). |
| `HelloReply` | Returns a single `message` string (field number 1). |

Field numbers (the `= 1` parts) identify fields in the binary encoding. Once
published, never renumber them.

Next: [03 Load the proto](./03-load-proto.md)
