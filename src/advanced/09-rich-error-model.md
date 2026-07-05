---
title: Rich error model
tier: advanced
platform: grpc
position: 9
---

# Rich error model

[Hub](https://alibaihaqi.github.io/learning-docs/) › gRPC › Advanced › Rich error model

**Goal**

Return structured error details using Google's rich error model — not just a status code and string, but typed protobuf messages.

**Prerequisites**

- [gRPC-web](./08-grpc-web.md)

## Install googleapis proto

```bash
npm install @googleapis/runtime
```

Or copy the well-known error detail protos from the [googleapis/googleapis](https://github.com/googleapis/googleapis) repo.

## Import error details

```protobuf
import "google/rpc/error_details.proto";
```

The standard error detail types:
- `RetryInfo` — when the client should retry
- `DebugInfo` — stack traces (internal only)
- `QuotaFailure` — rate limit exceeded
- `BadRequest` — field-level validation errors
- `PreconditionFailure` — entity state mismatch
- `ResourceInfo` — which resource caused the error

## Server-side rich errors

```typescript
import * as errorDetails from 'google/rpc/error_details_pb';

function createItem(name: string) {
  if (name.length < 3) {
    const fieldViolation = new errorDetails.BadRequest.FieldViolation();
    fieldViolation.setField('name');
    fieldViolation.setDescription('Must be at least 3 characters');

    const br = new errorDetails.BadRequest();
    br.addFieldViolations(fieldViolation);

    const status = new grpc.Status();
    status.setCode(grpc.status.INVALID_ARGUMENT);
    status.setMessage('Validation failed');
    status.addDetails(google_protobuf_Any.pack(br, 'google.rpc.BadRequest'));

    throw status;
  }
  // success
}
```

## Client-side error handling

```typescript
call.on('error', (error) => {
  if (error.code === grpc.status.INVALID_ARGUMENT) {
    // Parse rich details
    const status = grpc.Status.deserializeBinary(error.metadata['grpc-status-details-bin']);
    const details = status.getDetailsList();

    for (const anyMsg of details) {
      if (anyMsg.getTypeUrl().includes('BadRequest')) {
        const br = errorDetails.BadRequest.deserializeBinary(
          anyMsg.getValue_asU8()
        );
        for (const violation of br.getFieldViolationsList()) {
          console.error(`${violation.getField()}: ${violation.getDescription()}`);
          // → "name: Must be at least 3 characters"
        }
      }
    }
  }
});
```

## PreconditionFailure example

```typescript
const pf = new errorDetails.PreconditionFailure();
const violation = new errorDetails.PreconditionFailure.Violation();
violation.setType('INACTIVE_ACCOUNT');
violation.setSubject('user:alice');
violation.setDescription('Account has been deactivated');
pf.addViolations(violation);
```

## Checkpoint

```bash
npx ts-node server-rich-errors.ts &
# Send invalid request (name too short):
npx ts-node client-rich-errors.ts
# → "name: Must be at least 3 characters"
# → grpc.status: INVALID_ARGUMENT
```

**Next:** [Docker deployment](./10-docker-deployment.md) — containerize and deploy.
