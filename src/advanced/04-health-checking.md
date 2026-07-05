---
title: Health checking
tier: advanced
platform: grpc
position: 4
---

# Health checking

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Health checking

**Goal**

Implement the standard gRPC health checking protocol so load balancers and Kubernetes can probe service health.

**Prerequisites**

- [TLS encryption](./03-tls-encryption.md)

## Install the health package

```bash
npm install @grpc/grpc-js-health-check
```

## Add health service

```typescript
import { HealthCheckService } from '@grpc/grpc-js-health-check';

const health = new HealthCheckService({
  'chat.ChatService': 'SERVING',
});

const server = new grpc.Server();
health.addToServer(server);
server.addService(proto.ChatService.service, { Chat });

server.bindAsync('0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => server.start());
```

## Manual health check client

```typescript
import { health } from '@grpc/grpc-js-health-check';

const client = new health('localhost:50051',
  grpc.credentials.createInsecure());

client.check({ service: 'chat.ChatService' }, (err, resp) => {
  console.log(`Health status: ${resp.status}`);
  // SERVING (1), NOT_SERVING (2), UNKNOWN (0)
});

client.watch({ service: 'chat.ChatService' })
  .on('data', (resp) => console.log(`Status changed: ${resp.status}`));
```

## Kubernetes probe

In a Kubernetes Deployment, reference the health service:

```yaml
livenessProbe:
  grpc:
    port: 50051
    service: chat.ChatService
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Watch for status changes

```typescript
// Server-side watch
health.setStatus('chat.ChatService', 'NOT_SERVING');
// When database connection is lost
health.setStatus('chat.ChatService', 'SERVING');
// When recovered
```

## Checkpoint

```bash
npx ts-node server-health.ts &
npx ts-node client-health.ts
# → "Health status: SERVING"
```

**Next:** [Reflection](./05-reflection.md) — discoverable gRPC services.
