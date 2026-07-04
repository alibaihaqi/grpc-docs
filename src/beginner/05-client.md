---
title: 05 The client
---

# 05 The client

Create `client.js`:

```js
// client.js
const { grpc, proto } = require("./load");

const client = new proto.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

client.SayHello({ name: "Ada" }, (err, response) => {
  if (err) throw err;
  console.log(response.message);
});
```

How it works:

| Line | What it does |
|------|-------------|
| `require("./load")` | Same `grpc` + `proto` bindings used by the server. |
| `new proto.Greeter(...)` | Creates a stub connected to `localhost:50051`. `proto.Greeter` is a client constructor generated from the service definition. |
| `createInsecure()` | No TLS — matches the server's `createInsecure()` credentials. |
| `client.SayHello(...)` | Sends a `HelloRequest` with `name: "Ada"`. The callback receives `(err, response)` where `response` is the deserialized `HelloReply`. |
| `console.log(response.message)` | Prints the `message` field — you'll see `Hello, Ada`. |

The client connects lazily: the channel is created immediately but the
underlying TCP connection to port `50051` is established on the first call.

Next: [06 Run and inspect](./06-run-and-inspect.md)
