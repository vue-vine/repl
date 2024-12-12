import * as monaco from 'monaco-editor-core'
import { registerHighlighter } from './highlighter'

const basicEditorOptions = {
  fontSize: 13,
  tabSize: 2,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  minimap: {
    enabled: false,
  },
  inlineSuggest: {
    enabled: false,
  },
  fixedOverflowWidgets: true,
}

export function setupMonaco() {
  monaco.languages.register({ id: 'typescript' })
  monaco.languages.register({ id: 'javascript' })
  monaco.languages.register({ id: 'vine-ts' })
  monaco.languages.register({ id: 'css' })
  monaco.languages.register({ id: 'markdown' })
  monaco.languages.register({ id: 'json' })
  monaco.languages.register({ id: 'html' })

  const { theme } = registerHighlighter()

  const editorInitOptions = {
    ...basicEditorOptions,
    theme,
  }

  return {
    editorInitOptions,
  }
}
