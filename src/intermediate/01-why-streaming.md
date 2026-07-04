---
title: 01 Why streaming
---

# 01 Why streaming

Unary RPCs return one reply per request. That works well for lookups and commands,
but some responses are naturally sequential: a progress feed, a search result set,
or a series of greetings. Server-streaming lets the **server push many messages
over a single call** without the client polling or opening new connections.

## Unary vs server-streaming

| | Unary | Server-streaming |
|---|---|---|
| Requests | 1 | 1 |
| Replies | 1 | 0 … N, then stream ends |
| Use case | Single lookup, create | Feeds, progress, bulk results |

In a unary call the server calls `callback(null, response)` once and the call is
done. In server-streaming the server calls `call.write(chunk)` as many times as
needed and then `call.end()` to signal completion.

## When to use it

Use server-streaming when:
- The reply is large and you want to start processing before it all arrives.
- The number of results is unknown or unbounded.
- You want to push updates to the client without the client re-requesting.

The next page adds the `SayHellos` streaming method to `greeter.proto`.

Next: [02 The streaming proto](./02-streaming-proto.md)
