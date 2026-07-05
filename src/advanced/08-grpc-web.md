---
title: gRPC-web
tier: advanced
platform: grpc
position: 8
---

# gRPC-web

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › gRPC-web

**Goal**

Expose the gRPC service to browser clients via Envoy's gRPC-web filter. Call the Chat service from a JavaScript frontend.

**Prerequisites**

- [Client-side streaming](./07-client-streaming.md)

## The problem

Browsers cannot speak raw HTTP/2 gRPC (they don't have access to HTTP/2 frames). gRPC-web translates browser HTTP/1.1 requests into gRPC calls.

## Envoy proxy

Create `envoy.yaml`:

```yaml
static_resources:
  listeners:
  - name: grpc_web_listener
    address:
      socket_address: { address: 0.0.0.0, port_value: 8080 }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          codec_type: AUTO
          stat_prefix: grpc_web
          route_config:
            virtual_hosts:
            - name: backend
              domains: ["*"]
              routes:
              - match: { prefix: "/" }
                route:
                  cluster: grpc_backend
                  timeout: 0s
          http_filters:
          - name: envoy.filters.http.grpc_web
          - name: envoy.filters.http.router
  clusters:
  - name: grpc_backend
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    typed_extension_protocol_options:
      envoy.extensions.upstreams.http.v3.HttpProtocolOptions:
        "@type": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions
        explicit_http_config:
          http2_protocol_options: {}
    load_assignment:
      cluster_name: grpc_backend
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address: { address: host.docker.internal, port_value: 50051 }
```

Run Envoy:

```bash
docker run -p 8080:8080 -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml \
  envoyproxy/envoy:v1.32-latest
```

## Browser client

```html
<!DOCTYPE html>
<script src="https://unpkg.com/@grpc/grpc-js@1.12.6"></script>
<script src="https://unpkg.com/protobufjs@7.4.0"></script>
<script>
async function main() {
  const root = await protobuf.load('chat.proto');
  const ChatMessage = root.lookupType('chat.ChatMessage');

  // Using grpc-web client
  const client = new proto.ChatService('http://localhost:8080');

  const call = client.Chat({}, {});
  call.on('data', (msg) => {
    document.getElementById('messages').innerHTML +=
      `<div><b>${msg.user}:</b> ${msg.text}</div>`;
  });

  document.getElementById('send').onclick = () => {
    const text = document.getElementById('input').value;
    call.write({ user: 'browser', text });
  };
}
main();
</script>
```

## Checkpoint

```bash
# Start gRPC server
npx ts-node server.ts &

# Start Envoy
docker run -p 8080:8080 -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml \
  envoyproxy/envoy:v1.32-latest

# Open index.html in browser
# Type a message, click send → message echoed back via gRPC-web
```

**Next:** [Rich error model](./09-rich-error-model.md) — structured error details.
