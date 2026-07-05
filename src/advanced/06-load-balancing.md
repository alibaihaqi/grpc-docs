---
title: Load balancing
tier: advanced
platform: grpc
position: 6
---

# Load balancing

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Load balancing

**Goal**

Configure client-side load balancing across multiple gRPC server replicas using round-robin and name resolver.

**Prerequisites**

- [Reflection](./05-reflection.md)

## Why client-side load balancing

gRPC uses long-lived HTTP/2 connections. A traditional L7 load balancer (nginx, ELB) sees one connection, not individual RPCs. Client-side load balancing lets the gRPC client distribute RPCs across backends at the call level.

## Name resolver

```typescript
import { loadBalancingConfig } from '@grpc/grpc-js';

// Static resolver with multiple backends
const client = new proto.ChatService(
  'dns:///localhost:50051,localhost:50052,localhost:50053',
  grpc.credentials.createInsecure(),
  {
    'grpc.lb_policy_name': 'round_robin',
    'grpc.service_config': JSON.stringify({
      loadBalancingConfig: [{ round_robin: {} }],
      methodConfig: [{
        name: [{ service: 'chat.ChatService' }],
        retryPolicy: {
          maxAttempts: 3,
          initialBackoff: '0.1s',
          maxBackoff: '1s',
          backoffMultiplier: 2,
          retryableStatusCodes: ['UNAVAILABLE'],
        },
      }],
    }),
  }
);
```

## Start multiple servers

```bash
# Terminal 1
PORT=50051 npx ts-node server.ts

# Terminal 2
PORT=50052 npx ts-node server.ts

# Terminal 3
PORT=50053 npx ts-node server.ts
```

Update the server to read `process.env.PORT`.

## Verify round-robin

```typescript
for (let i = 0; i < 6; i++) {
  const call = client.Chat();
  call.write({ user: 'alice', text: `msg ${i}` });
  call.on('data', (msg) => {
    console.log(`Server ${call.call.channel.getTarget()}: ${msg.text}`);
  });
  call.end();
}
```

Each RPC hits a different backend in sequence.

## gRPC-LB protocol

For production, use a proxy like Envoy with the gRPC-LB protocol:

```yaml
# Envoy config snippet
listeners:
- address:
    socket_address: { address: 0.0.0.0, port_value: 50051 }
  filter_chains:
  - filters:
    - name: envoy.filters.network.http_connection_manager
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
        codec_type: AUTO
        stat_prefix: grpc_json
        route_config:
          virtual_hosts:
          - name: backend
            domains: ["*"]
            routes:
            - match: { prefix: "/" }
              route:
                cluster: chat_service
                max_grpc_timeout: 0s
        http_filters:
        - name: envoy.filters.http.router
```

## Checkpoint

```bash
# Three server terminals + one client
# Client distributes RPCs across all three servers
# If one server dies, retry policy sends to another
```

**Next:** [Client-side streaming](./07-client-streaming.md) — upload pattern with flow control.
