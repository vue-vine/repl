import { initProjectFileStore } from '@/stores/project-file'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'

function Header() {
  return vine`
    <header class="row-flex p-4">
      <div class="text-2xl">Vue Vine playground</div>
    </header>
  `
}

export function MainView() {
  const iframeRef = ref<HTMLIFrameElement | null>(null)
  const terminalRef = ref<HTMLDivElement | null>(null)
  const {
    isTerminalPrepared,
    fileTree,
  } = initProjectFileStore()

  onMounted(async () => {
    const { sandbox } = window
    if (!sandbox || !iframeRef.value || !terminalRef.value) {
      return
    }

    fileTree.value = sandbox.fileTree

    const fitAddon = new FitAddon()
    const terminal = new Terminal({
      convertEol: true,
    })
    terminal.loadAddon(fitAddon)
    terminal.open(terminalRef.value)
    fitAddon.fit()

    // Prepare sandbox
    await sandbox.prepare()

    // Mount project files in sandbox
    await sandbox.mountFiles()

    // Wait for `server-ready` event
    sandbox.onServerReady((port, url) => {
      if (!iframeRef.value)
        return

      iframeRef.value.src = url
    })

    // Start shell in sandbox
    await sandbox.startShell(terminal, {
      onInit: () => {
        isTerminalPrepared.value = true
      },
    })

    // Install dependencies
    await sandbox.pnpmInstall()

    // Start dev server
    await sandbox.startDevServer()
  })

  return vine`
    <Header />
    <iframe ref="iframeRef" class="w-50% h-400px" />
    <div
      ref="terminalRef"
      class="repl-terminal m-2"
      :style="{
        opacity: isTerminalPrepared ? 1 : 0,
      }"
    />
  `
}
