# Changelog

All notable changes to the gRPC learning-docs site. Newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-07-05 — Advanced tier

### Added
- **Advanced tier** (`src/advanced/`, 10 pages + index): production gRPC — bidirectional streaming chat, interceptors (logging, auth), TLS/mTLS, health checking, reflection, client-side load balancing, client-streaming upload, gRPC-web via Envoy, rich error model, and Docker deployment. Wired into the sidebar, nav, and home feature card.

## 2026-07-04 — Intermediate tier

### Added
- **Intermediate tier** (`src/intermediate/`, 6 pages): a server-streaming
  `SayHellos` RPC, error handling with gRPC status codes, and a client deadline
  — extending the beginner Greeter.

## 2026-07-04 — Beginner tier + toolchain alignment

### Added
- **Beginner tier** (`src/beginner/`, 6 pages): a unary Greeter gRPC service in
  Node — `greeter.proto` + server + client over `@grpc/grpc-js`.
- **`CLAUDE.md`** — public-safe repo conventions.

### Changed
- Upgraded VitePress to 1.6.4; pinned Node to 26.4.0 (`.node-version` + deploy
  workflow).

## Earlier — Protocol Buffers documentation

### Added
- Introduction and a Protocol Buffers section; VitePress site with GitHub Pages
  deploy.
