---
title: gRPC Advanced — interceptors, TLS, bidirectional streaming, deployment
tier: advanced
platform: grpc
---

# gRPC Advanced

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced

## What you'll build

You extend the intermediate Greeter into a production-grade gRPC service with bidirectional streaming, interceptors for logging and auth, TLS encryption, health checking, reflection, load balancing, gRPC-web for browsers, and Docker deployment.

## Prerequisites

- Complete the [Intermediate tier](../intermediate/) (server-streaming, errors, deadlines)
- Node.js 22+
- `@grpc/grpc-js` and `@grpc/proto-loader`

## The ladder

1. [01 Bidirectional streaming](./01-bidirectional-streaming.md) — chat-style RPC
2. [02 Interceptors](./02-interceptors.md) — logging, auth, and error interceptors
3. [03 TLS encryption](./03-tls-encryption.md) — mTLS between client and server
4. [04 Health checking](./04-health-checking.md) — gRPC health protocol
5. [05 Reflection](./05-reflection.md) — discoverable gRPC services
6. [06 Load balancing](./06-load-balancing.md) — round-robin across server replicas
7. [07 Client-side streaming](./07-client-streaming.md) — upload pattern with flow control
8. [08 gRPC-web](./08-grpc-web.md) — call gRPC from browsers via Envoy
9. [09 Rich error model](./09-rich-error-model.md) — structured error details
10. [10 Docker deployment](./10-docker-deployment.md) — containerize and deploy

**Start** → [01 Bidirectional streaming](./01-bidirectional-streaming.md)
