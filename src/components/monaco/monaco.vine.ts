import * as monaco from 'monaco-editor-core'
import { registerHighlighter } from './highlighter'

export function MonacoEditor() {
  let editorInstance: monaco.editor.IStandaloneCodeEditor
  const editor = ref<monaco.editor.IStandaloneCodeEditor | null>()
  const editorContainer = ref<HTMLDivElement | null>(null)

  const handleSaveContent = () => {
    // Todo ...
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
      value: '',
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
      class="repl-editor flex-1 h-full border-r border-gray-200 dark:border-gray-800"
      @keydown.ctrl.s.prevent="handleSaveContent"
      @keydown.meta.s.prevent="handleSaveContent"
    />
  `
}
