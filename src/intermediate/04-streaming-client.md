---
title: 04 The streaming client
---

# 04 The streaming client

Create `stream-client.js` to consume the `SayHellos` stream.

```js
// stream-client.js
const { grpc, proto } = require("./load");

const client = new proto.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

const call = client.SayHellos({ name: "Ada" });
call.on("data", (reply) => console.log(reply.message));
call.on("end", () => console.log("stream done"));
call.on("error", (err) => console.error("stream error:", err.message));
```

## How it works

| Line | What it does |
|---|---|
| `client.SayHellos(request)` | Starts the streaming call. Returns a readable stream — no callback. |
| `call.on("data", fn)` | Fires for each `HelloReply` the server writes. |
| `call.on("end", fn)` | Fires once after the server calls `call.end()`. |
| `call.on("error", fn)` | Fires on network errors or server-side status errors. |

The streaming client API is event-driven. You listen for `data` events (one per
`call.write` on the server side) and an `end` event that signals the stream is
finished.

## Checkpoint

With the server running (`node server.js` in another terminal):

```bash
node stream-client.js
```

**Expected output:**

```
Hello, Ada
Hi, Ada
Hey, Ada
stream done
```

Three `data` events fire (one per `call.write`), then the `end` event fires.

Next: [05 Errors and status codes](./05-errors-and-status.md)
