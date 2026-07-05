---
title: TLS encryption
tier: advanced
platform: grpc
position: 3
---

# TLS encryption

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › TLS encryption

**Goal**

Secure gRPC communication with TLS and mutual TLS (mTLS) using self-signed certificates for development.

**Prerequisites**

- [Interceptors](./02-interceptors.md)
- OpenSSL installed

## Generate certificates

```bash
# CA key and cert
openssl req -x509 -newkey rsa:4096 -days 365 -nodes \
  -keyout ca-key.pem -out ca-cert.pem \
  -subj "/CN=localhost"

# Server key and CSR
openssl req -newkey rsa:4096 -nodes \
  -keyout server-key.pem -out server-req.pem \
  -subj "/CN=localhost"

# Server cert signed by CA
openssl x509 -req -in server-req.pem \
  -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem \
  -extensions SAN \
  -extfile <(printf "[SAN]\nsubjectAltName=DNS:localhost")

# Client key and cert (for mTLS)
openssl req -newkey rsa:4096 -nodes \
  -keyout client-key.pem -out client-req.pem \
  -subj "/CN=client"
openssl x509 -req -in client-req.pem \
  -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out client-cert.pem
```

## TLS server

```typescript
import * as fs from 'fs';

const server = new grpc.Server();
server.addService(proto.ChatService.service, { Chat });

const creds = grpc.ServerCredentials.createSsl(
  fs.readFileSync('ca-cert.pem'),
  [{
    cert_chain: fs.readFileSync('server-cert.pem'),
    private_key: fs.readFileSync('server-key.pem'),
  }],
  true  // require client cert (mTLS)
);

server.bindAsync('0.0.0.0:50051', creds, () => server.start());
```

## TLS client

```typescript
const channelCreds = grpc.credentials.createSsl(
  fs.readFileSync('ca-cert.pem'),
  fs.readFileSync('client-key.pem'),
  fs.readFileSync('client-cert.pem')
);

const client = new proto.ChatService('localhost:50051', channelCreds);
```

## Checkpoint

```bash
npx ts-node server-tls.ts &
npx ts-node client-tls.ts
# Chat message "Hello!" echoed back over TLS
# Wireshark would show encrypted traffic

# Without cert:
# Error: UNAVAILABLE: Failed to connect
```

**Next:** [Health checking](./04-health-checking.md) — gRPC health protocol.
