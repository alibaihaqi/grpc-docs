---
title: Client-side streaming
tier: advanced
platform: grpc
position: 7
---

# Client-side streaming

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Client-side streaming

**Goal**

Build a client-streaming RPC that uploads a file in chunks (client sends multiple messages, server sends one response).

**Prerequisites**

- [Load balancing](./06-load-balancing.md)

## The proto

Add to `chat.proto`:

```protobuf
service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
  rpc Upload(stream FileChunk) returns (UploadStatus);  // new
}

message FileChunk {
  string filename = 1;
  bytes content = 2;
}

message UploadStatus {
  int64 size_bytes = 1;
  string message = 2;
}
```

## Server handler

```typescript
Upload: (call: grpc.ServerReadableStream<FileChunk>, callback: grpc.sendUnaryData<UploadStatus>) => {
  let totalBytes = 0;
  let fileName = '';

  call.on('data', (chunk: FileChunk) => {
    fileName = chunk.filename;
    totalBytes += chunk.content.length;
    console.log(`Received ${chunk.content.length} bytes for ${fileName}`);
  });

  call.on('end', () => {
    console.log(`Upload complete: ${fileName}, ${totalBytes} bytes`);
    callback(null, {
      sizeBytes: totalBytes,
      message: `Uploaded ${fileName} (${totalBytes} bytes)`,
    });
  });

  call.on('error', (err) => {
    callback({
      code: grpc.status.INTERNAL,
      details: `Upload failed: ${err.message}`,
    });
  });
}
```

## Client

```typescript
import * as fs from 'fs';

const call = client.Upload((error, response: UploadStatus) => {
  if (error) {
    console.error(`Upload failed: ${error.details}`);
  } else {
    console.log(`Server: ${response.message}`);
  }
});

const FILE = 'example.txt';
const CHUNK_SIZE = 64 * 1024; // 64KB
const fd = fs.openSync(FILE, 'r');
const buffer = Buffer.alloc(CHUNK_SIZE);
let offset = 0;
let bytesRead: number;

while ((bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, offset)) > 0) {
  call.write({
    filename: FILE,
    content: buffer.subarray(0, bytesRead),
  });
  offset += bytesRead;
}
fs.closeSync(fd);
call.end();
```

## Flow control

The client respects server-side flow control automatically via HTTP/2 flow control windows. To manually pause:

```typescript
if (call.writableEnded) return; // stop sending

// Check write queue
call.write(chunk, (err) => {
  if (err) console.error('Write error:', err);
});
```

## Checkpoint

```bash
echo "Hello World from gRPC upload" > example.txt
npx ts-node server.ts &
npx ts-node client-upload.ts
# → "Upload complete: example.txt, 32 bytes"
# → "Server: Uploaded example.txt (32 bytes)"
```

**Next:** [gRPC-web](./08-grpc-web.md) — call gRPC from browsers via Envoy.
