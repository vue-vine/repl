import * as monaco from 'monaco-editor-core'
import { registerHighlighter } from './highlighter'

export function MonacoEditor() {
  const emits = vineEmits<{
  change: [value: string]
  }>()

  let editorInstance: monaco.editor.IStandaloneCodeEditor
  const editor = ref<monaco.editor.IStandaloneCodeEditor | null>()
  const editorContainer = ref<HTMLDivElement | null>(null)

  const handleSaveContent = () => {
    emits('change', editorInstance.getValue() ?? '')
  }

  onMounted(() => {
    if (!editorContainer.value) {
      throw new Error('Monaco editor container not found')
    }

    monaco.languages.register({ id: 'typescript' })
    monaco.languages.register({ id: 'javascript' })
    monaco.languages.register({ id: 'vine-ts' })

    const { theme } = registerHighlighter()
    editorInstance = monaco.editor.create(editorContainer.value, {
      language: 'typescript',
      value: `
export function VineApp() {
  const count = ref(0)

  return vine\`
    <div>
      <p> Count: {{ count }} </p>
      <button @click="count += 1"> +1 </button>
      <button @click="count -= 1"> -1 </button>
    </div>
  \`
}
      `.trim(),
      fontSize: 13,
      tabSize: 2,
      theme,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
      inlineSuggest: {
        enabled: false,
      },
      fixedOverflowWidgets: true,
    })
    editor.value = editorInstance
  })

  return vine`
    <div
      ref="editorContainer"
      class="repl-editor w-full h-full"
      @keydown.ctrl.s.prevent="handleSaveContent"
      @keydown.meta.s.prevent="handleSaveContent"
    />
  `
}
