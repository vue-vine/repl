import { FileTree } from '@/components/file-tree.vine'
import { MonacoEditor } from '@/components/monaco/monaco.vine'
import { initProjectFileStore } from '@/stores/project-file'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'

function Header() {
  return vine`
    <header class="row-flex p-4 h-64px">
      <div class="text-2xl">Vue Vine playground</div>
    </header>
  `
}

export function MainView() {
  const iframeRef = useTemplateRef<HTMLIFrameElement>('iframeRef')
  const terminalRef = useTemplateRef<HTMLDivElement>('terminalRef')
  const terminalSpinner = useTemplateRef<HTMLDivElement>('terminalSpinner')

  const terminalHeight = ref<number>(Number.NaN)
  const terminalRenderHeight = computed(() => {
    return Number.isNaN(terminalHeight.value) ? undefined : `${terminalHeight.value}px`
  })

  const {
    isTerminalPrepared,
    fileTree,
  } = initProjectFileStore()

  onMounted(async () => {
    const { sandbox } = window
    if (!sandbox || !iframeRef.value || !terminalRef.value) {
      return
    }

    terminalHeight.value = terminalSpinner.value?.clientHeight ?? 0

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
        terminalSpinner.value?.remove()
      },
    })

    // Install dependencies
    await sandbox.pnpmInstall()

    // Start dev server
    await sandbox.startDevServer()
  })

  return vine`
    <div class="col-flex h-100vh">
      <Header class="flex-shrink-0" />
      <div class="flex-1 col-flex">
        <div class="row-flex h-64vh flex-shrink-0">
          <div class="w-65% row-flex h-full border-0.5px border-zinc-7">
            <FileTree />
            <MonacoEditor />
          </div>
          <iframe
            ref="iframeRef"
            class="w-35% h-full border-0.5px border-zinc-7 p-4"
          />
        </div>

        <div
          class="relative w-full flex-1 overflow-hidden"
          :style="{ height: terminalRenderHeight }"
        >
          <div
            ref="terminalSpinner"
            class="border-0.5px border-zinc-7 shadow row-flex justify-center text-2xl w-full h-full absolute top-0 left-50% translate-x--50% bg-dark-8"
          >
            Loading shell environment ...
          </div>
          <div
            ref="terminalRef"
            class="repl-terminal overflow-hidden"
            :style="{
              opacity: isTerminalPrepared ? 1 : 0,
              height: terminalRenderHeight,
            }"
          />
        </div>
      </div>
    </div>
  `
}
