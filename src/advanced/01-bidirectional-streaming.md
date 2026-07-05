---
title: Bidirectional streaming
tier: advanced
platform: grpc
position: 1
---

# Bidirectional streaming

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Bidirectional streaming

**Goal**

Build a bidirectional streaming RPC — a chat service where both sides send multiple messages independently.

**Prerequisites**

- Intermediate tier (server-streaming Greeter)

## The proto

Save as `protos/chat.proto`:

```protobuf
syntax = "proto3";

package chat;

service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}

message ChatMessage {
  string user = 1;
  string text = 2;
}
```

Generate: `npx grpc-tools` or let the server load the proto dynamically.

## The server

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('protos/chat.proto');
const proto = grpc.loadPackageDefinition(packageDef).chat as any;

const server = new grpc.Server();
server.addService(proto.ChatService.service, {
  Chat: (call: grpc.ServerDuplexStream<ChatMessage, ChatMessage>) => {
    console.log('Chat session started');

    call.on('data', (msg: ChatMessage) => {
      console.log(`${msg.user}: ${msg.text}`);
      call.write({
        user: 'server',
        text: `Echo: ${msg.text}`,
      });
    });

    call.on('end', () => {
      call.end();
      console.log('Chat session ended');
    });
  },
});

server.bindAsync('0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => { server.start(); console.log('Chat server on :50051'); });
```

## The client

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('protos/chat.proto');
const proto = grpc.loadPackageDefinition(packageDef).chat as any;

const client = new proto.ChatService('localhost:50051',
  grpc.credentials.createInsecure());

const call = client.Chat();

call.on('data', (msg: ChatMessage) => {
  console.log(`Server: ${msg.text}`);
});

call.on('end', () => console.log('Chat ended'));

call.write({ user: 'alice', text: 'Hello!' });
setTimeout(() => call.write({ user: 'alice', text: 'How are you?' }), 500);
setTimeout(() => call.end(), 1000);
```

## Checkpoint

```bash
npx ts-node server.ts &
npx ts-node client.ts
# Server logs:
#   Chat session started
#   alice: Hello!
#   alice: How are you?
# Client logs:
#   Server: Echo: Hello!
#   Server: Echo: How are you?
#   Chat ended
```

**Next:** [Interceptors](./02-interceptors.md) — logging, auth, and error interceptors.
