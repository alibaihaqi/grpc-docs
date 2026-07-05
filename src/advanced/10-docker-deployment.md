---
title: Docker deployment
tier: advanced
platform: grpc
position: 10
---

# Docker deployment

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Docker deployment

**Goal**

Containerize the gRPC server with a multistage Dockerfile and deploy with docker-compose alongside Envoy for gRPC-web.

**Prerequisites**

- [Rich error model](./09-rich-error-model.md)

## Multistage Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npx tsc

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/protos ./protos
EXPOSE 50051
CMD ["node", "dist/server.js"]
```

## .dockerignore

```
node_modules/
dist/
*.pem
*.ts
```

## docker-compose.yml

```yaml
services:
  grpc-server:
    build: .
    ports:
      - "50051:50051"
    healthcheck:
      test: ["CMD", "grpc_health_probe", "-addr=:50051"]
      interval: 10s
      retries: 3

  envoy:
    image: envoyproxy/envoy:v1.32-latest
    ports:
      - "8080:8080"
    volumes:
      - ./envoy.yaml:/etc/envoy/envoy.yaml
    depends_on:
      grpc-server:
        condition: service_healthy
```

## Multi-architecture build

For deployment on ARM (Apple Silicon) and AMD64:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/your-org/grpc-chat:latest \
  --push .
```

## Production checklist

- [ ] TLS certificates (not self-signed in production)
- [ ] Health checks configured
- [ ] Client-side retry with backoff
- [ ] Rate limiting (Envoy or application-level)
- [ ] Monitoring (Prometheus metrics)
- [ ] gRPC-web path for browser clients
- [ ] Graceful shutdown (SIGTERM → drain → stop)

## Graceful shutdown

```typescript
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.tryShutdown(() => process.exit(0));
});
```

## Checkpoint

```bash
docker compose up --build -d
# gRPC server on :50051
# Envoy on :8080 (gRPC-web proxy)

# Test with grpcurl:
grpcurl -plaintext localhost:50051 list
# chat.ChatService

# Test via Envoy:
grpcurl -plaintext localhost:8080 list
# chat.ChatService
# (proxied through Envoy)

docker compose down -v
```

**You've completed the gRPC Advanced tier.** The intermediate Greeter has grown into a production-grade gRPC stack with bidirectional streaming, interceptors, TLS, health checking, reflection, load balancing, client-streaming, gRPC-web, rich error models, and Docker deployment.
