import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/grpc-docs/',
  cleanUrls: true,
  lang: 'en-US',
  lastUpdated: true,
  srcDir: 'src',

  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    // fr: {
    //   label: 'French',
    //   lang: 'fr', // optional, will be added  as `lang` attribute on `html` tag
    // }
  },

  head: [
    ['link', { rel: 'icon', href: 'https://www.alibaihaqi.com/favicon.ico' }]
  ],

  title: 'gRPC Documentation',
  description: 'gRPC Documentation Collection',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/' },
      { text: 'Protocol Buffer', link: '/protocol-buffer/'},
      { text: 'Beginner', link: '/beginner/' },
      { text: 'Intermediate', link: '/intermediate/' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      copyright: 'Copyright © 2023 - Present by Fadli Al Baihaqi'
    },

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Getting Started', link: '/introduction/getting-started' }
        ]
      },
      {
        text: 'Protocol Buffer',
        items: [
          { text: 'What is Protocol Buffer?', link: '/protocol-buffer/' },
          { text: 'Why Protocol Buffer?', link: '/protocol-buffer/why-protocol-buffer' },
        ]
      },
      {
        text: 'Beginner',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/beginner/' },
          { text: '01 What is gRPC', link: '/beginner/01-what-is-grpc' },
          { text: '02 Define the proto', link: '/beginner/02-define-proto' },
          { text: '03 Load the proto', link: '/beginner/03-load-proto' },
          { text: '04 The server', link: '/beginner/04-server' },
          { text: '05 The client', link: '/beginner/05-client' },
          { text: '06 Run and inspect', link: '/beginner/06-run-and-inspect' },
        ],
      },
      {
        text: 'Intermediate',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/intermediate/' },
          { text: '01 Why streaming', link: '/intermediate/01-why-streaming' },
          { text: '02 The streaming proto', link: '/intermediate/02-streaming-proto' },
          { text: '03 The streaming server', link: '/intermediate/03-streaming-server' },
          { text: '04 The streaming client', link: '/intermediate/04-streaming-client' },
          { text: '05 Errors and status codes', link: '/intermediate/05-errors-and-status' },
          { text: '06 Deadlines and run', link: '/intermediate/06-deadlines-and-run' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alibaihaqi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alibaihaqi/' }
    ]
  }
})
