---
title: 03 The streaming server
---

# 03 The streaming server

Add the `sayHellos` handler to `server.js` and register it alongside `sayHello`.

```js
// server.js
const { grpc, proto } = require("./load");

function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}` });
}

function sayHellos(call) {
  const name = call.request.name;
  for (const g of ["Hello", "Hi", "Hey"]) {
    call.write({ message: `${g}, ${name}` });
  }
  call.end();
}

const server = new grpc.Server();
server.addService(proto.Greeter.service, {
  SayHello: sayHello,
  SayHellos: sayHellos,
});
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => console.log("Greeter listening on :50051"),
);
```

## How `sayHellos` works

| Line | What it does |
|---|---|
| `function sayHellos(call)` | Streaming handlers take only `call` — no `callback`. |
| `call.request.name` | The client's `HelloRequest.name`, same as in unary. |
| `call.write({ message })` | Pushes one `HelloReply` to the client. May be called many times. |
| `call.end()` | Signals the stream is complete. The client receives an `end` event. |

The `addService` call now maps both methods. gRPC routes each incoming RPC to
the correct handler by method name.

## Checkpoint

Start the server:

```bash
node server.js
# Greeter listening on :50051
```

The server should start without errors. Leave it running for the next page.

Next: [04 The streaming client](./04-streaming-client.md)
