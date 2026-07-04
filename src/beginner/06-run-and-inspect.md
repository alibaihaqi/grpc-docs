---
title: 06 Run and inspect
---

# 06 Run and inspect

You now have four files in your project:

```
greeter/
  greeter.proto
  load.js
  server.js
  client.js
  package.json
  node_modules/
```

## Start the server

Open a terminal and run:

```bash
node server.js   # Greeter listening on :50051
```

The server blocks and listens on port `50051`. Leave this terminal open.

## Run the client

Open a second terminal in the same directory and run:

```bash
node client.js   # Hello, Ada
```

**Expected output:**

```
Hello, Ada
```

The client connects to `localhost:50051`, sends `SayHello({ name: "Ada" })`,
receives the reply, prints `response.message`, and exits.

## What just happened

```
client.js  →  HelloRequest { name: "Ada" }  →  server.js
           ←  HelloReply { message: "Hello, Ada" }  ←
```

1. The client serialized `{ name: "Ada" }` into Protocol Buffers binary.
2. Sent it over HTTP/2 to `localhost:50051`.
3. The server deserialized the request, ran `sayHello`, and returned the reply.
4. The client deserialized the reply and printed `message`.

## Stopping the server

Press `Ctrl+C` in the server terminal.

## What's next

- Add a second method to `greeter.proto` (e.g., `SayGoodbye`) — wire up a new
  handler and observe how the proto change propagates through server and client.
- Swap `createInsecure()` for TLS credentials to secure the channel.
- Move to a server-streaming or bidirectional-streaming RPC to go beyond unary.
