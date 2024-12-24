import { fileURLToPath } from 'node:url'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { VineVitePlugin } from 'vue-vine/vite'

export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  resolve: {
    conditions: ['dev'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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

    Inspect(),
  ],
})
