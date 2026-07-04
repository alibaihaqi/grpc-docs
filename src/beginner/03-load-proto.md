---
title: 03 Load the proto
---

# 03 Load the proto

Both the server and client need the gRPC bindings derived from `greeter.proto`.
Extract that work into a shared `load.js`:

```js
// load.js
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const packageDefinition = protoLoader.loadSync("greeter.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).greeter;

module.exports = { grpc, proto };
```

What happens here:

1. `protoLoader.loadSync` reads `greeter.proto` from disk and parses it into a
   plain JS object (no code generation).
2. `grpc.loadPackageDefinition` wraps that object with the gRPC runtime, giving
   you service constructors and service descriptors.
3. `.greeter` selects the `package greeter` namespace — matching the `package`
   declaration in the proto file.
4. `proto.Greeter` is now a client constructor; `proto.Greeter.service` is the
   service descriptor used by the server.

**Checkpoint** — run this in your project directory (with `greeter.proto`
present):

```bash
node -e "console.log(!!require('./load').proto.Greeter)"
```

Expected output:

```
true
```

If you see `false` or an error, check that `greeter.proto` is in the same
directory as `load.js`.

Next: [04 The server](./04-server.md)
