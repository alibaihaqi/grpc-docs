---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "gRPC Documentation"
  tagline: Build your API using gRPC
  actions:
    - theme: brand
      text: Introduction
      link: /introduction/
    - theme: alt
      text: Getting Started
      link: /introduction/getting-started

features:
  - title: Protocol Buffers
    details: Understand the protocol buffers
    link: '/protocol-buffer/'
  - title: Beginner
    details: Build a unary Greeter gRPC service in Node.js — proto, server, and client
    link: '/beginner/'
  - title: Intermediate
    details: Extend the Greeter with server-streaming, error handling, and client deadlines
    link: '/intermediate/'
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-name-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
}
</style>