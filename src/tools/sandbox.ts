import type { FileSystemTree, ServerReadyListener } from '@webcontainer/api'
import type { Terminal } from '@xterm/xterm'
import { WebContainer } from '@webcontainer/api'
import { getProjectTemplate } from './project-template'

const jshFinishSymbol = '[?2004h'
const workdirName = 'vue-vine-playground'
const workdirAbsPath = `/home/${workdirName}`
const jshrc = `
export PNPM_HOME="/home/.pnpm"
export PATH="/bin:/usr/bin:/usr/local/bin:/home/.pnpm"
alias git='npx -y --package=g4c@stable -- g4c'
alias ni='npx -y --package=@antfu/ni -- ni'
`

export class Sandbox {
  private shellReady = false
  private outputCallbacks: ((data: string) => void)[] = []
  private shellInput: WritableStreamDefaultWriter<string> | null = null
  private webcontainerInstance

  public fileTree: FileSystemTree

  static async create() {
    const instance = await WebContainer.boot({ workdirName })
    const sandbox = new Sandbox(instance)
    window.sandbox = sandbox
  }

  constructor(
    webcontainerInstance: WebContainer,
  ) {
    this.webcontainerInstance = webcontainerInstance
    this.fileTree = getProjectTemplate()
  }

  private handleTerminalOutput(data: string) {
    // When [?2004h is seen, it means the shell prompt has been fully initialized
    if (data.includes(jshFinishSymbol)) {
      this.shellReady = true
    }

    this.outputCallbacks.forEach(cb => cb(data))
  }

  private removeOutputCallback(callback: (data: string) => void) {
    this.outputCallbacks = this.outputCallbacks.filter(cb => cb !== callback)
  }

  private waitForShellTaskFinish(
    resolve: () => void,
    finishSymbol = jshFinishSymbol,
  ) {
    const callback = (data: string) => {
      if (data.includes(finishSymbol)) {
        this.removeOutputCallback(callback)
        resolve()
      }
    }
    this.outputCallbacks.push(callback)
  }

  private async jshRun(command: string) {
    if (!this.shellInput)
      throw new Error('jsh is not initialized')

    return new Promise<void>((resolve) => {
      this.waitForShellTaskFinish(resolve)
      this.shellInput?.write(`${command}\r`)
    })
  }

  private async clearScreen() {
    await this.jshRun('clear')
  }

  public async prepare() {
    await this.webcontainerInstance.fs.writeFile('.jshrc', jshrc)
    await this.webcontainerInstance.spawn('mv', ['.jshrc', '/home/.jshrc'])
  }

  public async mountFiles() {
    await this.webcontainerInstance.mount(
      getProjectTemplate(),
    )

    console.log('[REPL] Vue Vine playground project template files mounted.')
  }

  public async onServerReady(callback: ServerReadyListener) {
    this.webcontainerInstance.on('server-ready', callback)
  }

  public async startShell(
    terminal: Terminal,
    {
      onInit,
    }: {
      onInit?: () => void
    } = {},
  ) {
    const jsh = await this.webcontainerInstance.spawn('jsh', {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    })

    // Make sure to save the writer only once
    this.shellInput = jsh.input.getWriter()

    // Pipe terminal to shell and vice versa
    jsh.output.pipeTo(
      new WritableStream({
        write: (data) => {
          terminal.write(data)
          this.handleTerminalOutput(data)
        },
      }),
    )
    terminal.onData((data) => {
      this.shellInput?.write(data)
    })

    // Wait for shell to be ready
    await new Promise<void>((resolve) => {
      if (this.shellReady) {
        resolve()
        return
      }

      this.waitForShellTaskFinish(resolve)
    })

    // Upgrade pnpm to v9
    await this.upgradePnpmV9()
    await this.clearScreen()

    onInit?.()

    return jsh
  }

  public async upgradePnpmV9() {
    await this.jshRun('pnpm add -g pnpm@9')
  }

  public async pnpmInstall() {
    await this.jshRun('pnpm install')
  }

  public async startDevServer() {
    await this.jshRun('pnpm run dev')
  }

  public async writeFile(path: string, content: string) {
    const absolutePath = (
      path.startsWith('/')
        ? path
        : `${workdirAbsPath}/${path}`
    )
    await this.webcontainerInstance.fs.writeFile(absolutePath, content)
  }
}
