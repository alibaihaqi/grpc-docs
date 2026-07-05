---
title: Interceptors
tier: advanced
platform: grpc
position: 2
---

# Interceptors

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Interceptors

**Goal**

Add client and server interceptors for logging, authentication, and error handling.

**Prerequisites**

- [Bidirectional streaming](./01-bidirectional-streaming.md)

## Server logging interceptor

```typescript
import { ServerInterceptor } from '@grpc/grpc-js';

function loggingInterceptor: ServerInterceptor =
  (call, definition) => {
    const start = Date.now();
    return new Promise((resolve) => {
      const result = definition(call);
      const duration = Date.now() - start;
      console.log(`${call.call.method} ${duration}ms`);
      resolve(result);
    });
  };
```

Apply to the server:

```typescript
server = new grpc.Server({
  interceptors: [loggingInterceptor],
});
```

## Server auth interceptor

```typescript
function authInterceptor: ServerInterceptor =
  (call, definition) => {
    const metadata = call.metadata;
    const token = metadata.get('authorization')[0];

    if (token !== 'Bearer valid-token') {
      call.sendError({
        code: grpc.status.UNAUTHENTICATED,
        details: 'Invalid token',
      });
      return; // reject
    }
    return definition(call);
  };
```

## Client interceptors

```typescript
const client = new proto.ChatService('localhost:50051',
  grpc.credentials.createInsecure(),
  {
    interceptors: [{
      intercept: (options, nextCall) => {
        return new grpc.InterceptingCall(nextCall(options), {
          start: (metadata, listener, next) => {
            metadata.add('authorization', 'Bearer valid-token');
            next(metadata, listener);
          },
        });
      },
    }],
  });
```

## Checkpoint

```bash
npx ts-node server.ts &
# Without valid token:
npx ts-node client.ts  # modified to not send token
# → UNAUTHENTICATED error

# With valid token (via interceptor):
npx ts-node client.ts
# → works, server logs "Chat session started"
```

**Next:** [TLS encryption](./03-tls-encryption.md) — mTLS between client and server.
