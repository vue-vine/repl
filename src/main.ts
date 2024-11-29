import { createApp } from 'vue'
import { App as VineApp } from './app.vine'
import router from './router'
import { Sandbox } from './tools/sandbox'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import '@xterm/xterm/css/xterm.css'

// Custom styles
import './styles/main.css'

Sandbox.create()
  .then(() => {
    console.log('[REPL] Sandbox created.')
    document.getElementById('loadingSpinner')?.remove()

    const app = createApp(VineApp)
    app.use(router)
    app.mount('#app')
  })
