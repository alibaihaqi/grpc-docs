---
title: 04 The server
---

# 04 The server

Create `server.js`:

```js
// server.js
const { grpc, proto } = require("./load");

function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}` });
}

const server = new grpc.Server();
server.addService(proto.Greeter.service, { SayHello: sayHello });
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => console.log("Greeter listening on :50051"),
);
```

How it works:

| Line | What it does |
|------|-------------|
| `require("./load")` | Gets the `grpc` runtime and the `proto` package bindings. |
| `sayHello` | Implements the `SayHello` RPC. `call.request.name` is the field from `HelloRequest`. `callback(null, {...})` sends `HelloReply`. |
| `new grpc.Server()` | Creates a bare gRPC server. |
| `addService` | Registers the `Greeter` service using `proto.Greeter.service` (the descriptor) and maps each method name to a handler function. |
| `bindAsync` | Binds to all interfaces on port `50051` with no TLS. The callback fires once the port is open. |

The handler signature is `(call, callback)`:
- `call.request` — the deserialized `HelloRequest`.
- `callback(error, response)` — call with `null` error and the `HelloReply` object.

Next: [05 The client](./05-client.md)
