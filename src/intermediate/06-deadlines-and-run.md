---
title: 06 Deadlines and run
---

# 06 Deadlines and run

A **deadline** tells gRPC how long the client is willing to wait for a response.
If the call takes longer, gRPC cancels it on both sides and returns a
`DEADLINE_EXCEEDED` error. Always set a deadline in production — an unresponsive
server will otherwise block the client indefinitely.

## Set a deadline on a unary call

```js
const deadline = new Date(Date.now() + 5000); // 5 s from now
client.SayHello({ name: "Ada" }, { deadline }, (err, response) => {
  if (err) { console.error(`error ${err.code}: ${err.details}`); return; }
  console.log(response.message);
});
```

Pass the options object `{ deadline }` as the second argument (between request
and callback). `deadline` is a `Date` representing the absolute wall-clock
expiry time.

## What your project looks like now

```
greeter/
  greeter.proto       ← SayHello + SayHellos
  load.js             ← shared grpc + proto loader
  server.js           ← sayHello (validated) + sayHellos
  client.js           ← unary call with deadline
  stream-client.js    ← streaming call
  package.json
  node_modules/
```

## Run the whole thing

Open two terminals in the `greeter/` directory.

**Terminal 1 — start the server:**

```bash
node server.js
# Greeter listening on :50051
```

**Terminal 2 — run the clients:**

```bash
node client.js
# Hello, Ada

node stream-client.js
# Hello, Ada
# Hi, Ada
# Hey, Ada
# stream done
```

## Test the deadline

Stop the server (`Ctrl+C` in terminal 1), then run the deadline'd client:

```bash
node client.js
# error 14: No connection established
```

With the server down the call fails within ~5 s (`UNAVAILABLE`; the TCP connect
itself times out before the deadline, so you see code 14 rather than 4). Set a
very short deadline (`100` ms) against a slow server to observe
`DEADLINE_EXCEEDED` (code 4).

## What's next

- Add **bidirectional streaming** — the client and server both stream concurrently.
- Explore **TLS credentials** (`grpc.credentials.createSsl(...)`) to secure the channel.
- Try **metadata** — attach key/value pairs to calls (similar to HTTP headers).
- Use **interceptors** for cross-cutting concerns like logging and retry.
