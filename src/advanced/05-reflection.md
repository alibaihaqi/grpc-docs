---
title: Reflection
tier: advanced
platform: grpc
position: 5
---

# Reflection

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Reflection

**Goal**

Enable gRPC reflection so tools like `grpcurl` can discover services and call RPCs without the proto file.

**Prerequisites**

- [Health checking](./04-health-checking.md)

## Why reflection

Without reflection, a gRPC client (or CLI tool) needs the `.proto` file to know the service definition. Reflection lets clients discover:
- Available services and methods
- Message types and fields
- Serialized wire format

This is essential for debugging, monitoring, and generic gRPC clients.

## Enable reflection

```typescript
import { ReflectionService } from '@grpc/reflection';

const reflection = new ReflectionService(packageDef);
reflection.addToServer(server);
```

Add before `server.bindAsync`.

## Using grpcurl

```bash
# Install grpcurl
brew install grpcurl

# List services
grpcurl -plaintext localhost:50051 list
# chat.ChatService
# grpc.health.v1.Health
# grpc.reflection.v1.ServerReflection

# Describe service
grpcurl -plaintext localhost:50051 describe chat.ChatService

# Call an RPC
echo '{"user":"alice","text":"hello"}' | \
  grpcurl -plaintext -d @ localhost:50051 chat.ChatService/Chat

# Describe message type
grpcurl -plaintext localhost:50051 describe chat.ChatMessage
# chat.ChatMessage is a message:
#     string user (1)
#     string text (2)
```

## grpcurl with TLS

```bash
grpcurl -cacert ca-cert.pem -cert client-cert.pem -key client-key.pem \
  localhost:50051 list
```

## Checkpoint

```bash
grpcurl -plaintext localhost:50051 list
# chat.ChatService
# grpc.health.v1.Health
```

**Next:** [Load balancing](./06-load-balancing.md) — round-robin across server replicas.
