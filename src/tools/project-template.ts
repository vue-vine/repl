import type { DirectoryNode, FileNode, FileSystemTree } from '@webcontainer/api'

function formatTrim(content: string) {
  return `${content.trimStart().trimEnd()}\n`
}
function file(content: string): FileNode {
  return {
    file: {
      contents: formatTrim(content),
    },
  }
}
function dir(innerTree: FileSystemTree): DirectoryNode {
  return {
    directory: innerTree,
  }
}

export function getProjectTemplate(): FileSystemTree {
  return {
    'public': dir({
      'favicon.svg': file(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    path { fill: #222; }
    @media (prefers-color-scheme: dark) {
      path { fill: #ffffff; }
    }
  </style>
  <path d="M27.562 26L17.17 8.928l2.366-3.888L17.828 4L16 7.005L14.17 4l-1.708 1.04l2.366 3.888L4.438 26H2v2h28v-2zM16 10.85L25.22 26H17v-8h-2v8H6.78z" />
</svg>
    `),
    }),
    'src': dir({
      'styles': dir({
        'main.css': file(`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html.dark {
  background: #121212;
  color: #fff;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
      `),
      }),
      'components': dir({
      // Empty folder
      }),
      'pages': dir({
        'About.vine.ts': file(`
export function About() {
  return vine\`
    <div class="page-about">
      <h1>About</h1>
      <p>This is a Vue Vine playground.</p>
      <p>Made with <a href="https://vue-vine.dev">Vue Vine</a> and <a href="https://webcontainers.io/">WebContainers</a>.</p>
    </div>
  \`
}
      `),
        'Home.vine.ts': file(`
function Header() {
  return vine\`
    <header class="header font-mono">
      <h1>Vue Vine Playground</h1>
      <nav>
        <ul class="row-flex">
          <li class="mr-2"><router-link to="/">Home</router-link></li>
          <li class="mr-2"><router-link to="/about">About</router-link></li>
        </ul>
      </nav>
    </header>
  \`
}

function Counter() {
  const count = ref(0)

  return vine\`
    <div class="counter">
      <p>Count: {{ count }}</p>
      <button class="mr-2" @click="count += 1"> +1 </button>
      <button class="mr-2" @click="count -= 1"> -1 </button>
    </div>
  \`
}

export function Home() {
  return vine\`
    <div class="page-home">
      <Header />
      <Counter />
    </div>
  \`
}
      `),
      }),
      'app.vine.ts': file(`
export function App() {
  return vine\`
    <div class="vue-vine-playground">
      <router-view></router-view>
    </div>
  \`
}
    `),
      'main.ts': file(`
import { createApp } from 'vue'
import { App as VineApp } from './app.vine'
import router from './router'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/main.css'

const app = createApp(VineApp)
app.use(router)
app.mount('#app')
    `),
      'router.ts': file(`
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
    `),
    }),
    'eslint.config.mjs': file(`
// @ts-check

import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'

export default antfu(
  { /* Override Antfu's default settings */ },
  ...VueVine(), // Load VueVine's ESLint config
)
  `),
    'index.html': file(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <title>Vue Vine Playground</title>
  <meta name="description" content="Vue Vine Template">
</head>
<body class="font-sans dark:text-white dark:bg-hex-121212">
  <div id="app"></div>
  <noscript>
    <div>Please enable JavaScript to use this application.</div>
  </noscript>
  <script>
    (function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('color-schema') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  </script>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
  `),
    'package.json': file(`
{
  "name": "vue-vine-repl",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "description": "Vue Vine playground",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@antfu/eslint-config": "*",
    "@vue-vine/eslint-config": "*",
    "@vueuse/core": "*",
    "eslint": "*",
    "vue": "*",
    "vue-router": "*"
  },
  "devDependencies": {
    "@types/node": "*",
    "@unocss/reset": "*",
    "typescript": "*",
    "unocss": "*",
    "unplugin-auto-import": "*",
    "vite": "*",
    "vue-vine": "*"
  }
}
  `),
    'README.md': file(`
# Vue Vine Playground

Learn more about Vue Vine in the [Vue Vine documentation](https://vue-vine.dev/)

## Development

\`\`\`sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`
  `),
    'tsconfig.json': file(`
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "types": [
      "vite/client",
      "vue-vine/macros"
    ],
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "exclude": [
    "dist",
    "node_modules"
  ]
}
  `),
    'uno.config.ts': file(`
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        'src/**/*.vine.ts',
      ],
    },
  },
  shortcuts: [
    ['row-flex', 'flex flex-row items-center'],
    ['col-flex', 'flex flex-col'],
  ],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
  `),
    'vite.config.ts': file(`
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { VineVitePlugin } from 'vue-vine/vite'

export default defineConfig({
  plugins: [
    VineVitePlugin(),

    AutoImport({
      include: [
        /\.[tj]s$/, // .ts, .tsx, .js, .jsx
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
      dirs: [
        './src/pages',
        './src/components',
      ],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
  ]
})
  `),
  }
}
