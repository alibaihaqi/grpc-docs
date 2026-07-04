---
title: 05 Errors and status codes
---

# 05 Errors and status codes

gRPC has a standard set of status codes (like HTTP status codes, but for RPC).
Instead of throwing exceptions, the server passes an error object with a `code`
and `message` to the callback. The client receives it as an `err` in the callback
(unary) or an `error` event (streaming).

## Update `sayHello` to validate input

```js
// server.js — updated sayHello
function sayHello(call, callback) {
  if (!call.request.name) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "name required",
    });
  }
  callback(null, { message: `Hello, ${call.request.name}` });
}
```

## Handle the error in the client

```js
// client.js — handle the error case
client.SayHello({ name: "" }, (err, response) => {
  if (err) {
    console.error(`error ${err.code}: ${err.details}`);
    return;
  }
  console.log(response.message);
});
```

## Common gRPC status codes

| Code | Value | Meaning |
|---|---|---|
| `OK` | 0 | Success |
| `CANCELLED` | 1 | Operation cancelled by caller |
| `INVALID_ARGUMENT` | 3 | Bad input from the client |
| `NOT_FOUND` | 5 | Resource does not exist |
| `ALREADY_EXISTS` | 6 | Resource already exists |
| `PERMISSION_DENIED` | 7 | Not authorized |
| `INTERNAL` | 13 | Server-side error |
| `UNAVAILABLE` | 14 | Server is down or overloaded |
| `DEADLINE_EXCEEDED` | 4 | Call ran past its deadline |

Use `grpc.status.<NAME>` in Node — they are integers under the hood.

## Checkpoint

Update `server.js` with the validation. Then call with an empty name:

```bash
node client.js   # with name: ""
# error 3: name required
```

`3` is `INVALID_ARGUMENT`. Call with a valid name and you still get `Hello, Ada`.

Next: [06 Deadlines and run](./06-deadlines-and-run.md)
