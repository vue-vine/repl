import { useProjectFileStore } from '@/stores/project-file'
import * as monaco from 'monaco-editor-core'
import { setupMonaco } from './setup'

const extToLangMap = {
  ts: 'typescript',
  js: 'javascript',
  mjs: 'javascript',
  json: 'json',
  svg: 'html',
  css: 'css',
  html: 'html',
  md: 'markdown',
} as const

export function MonacoEditor() {
  let editorInstance: monaco.editor.IStandaloneCodeEditor
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>()
  const editorContainer = useTemplateRef<HTMLDivElement>('editorContainer')
  const isSettingModel = ref(false)

  const store = useProjectFileStore()

  // 监听编辑器内容变化
  const debouncedUpdate = useDebounceFn(async (content: string) => {
    if (!store.activeFile.value || isSettingModel.value)
      return
    await store.updateFileContent(store.activeFile.value.path, content)
  }, 300)

  const handleSaveContent = async () => {
    if (!editor.value || !store.activeFile.value)
      return

    const content = editor.value.getValue()
    await store.updateFileContent(store.activeFile.value.path, content)
  }

  watch(store.activeFile, (file) => {
    if (!editor.value || !file)
      return

    isSettingModel.value = true
    try {
      // 获取文件扩展名
      const ext = file.path.split('.').pop() || ''
      const language = (
        extToLangMap[ext as keyof typeof extToLangMap]
        || 'plaintext'
      )

      // 为新文件创建新的 model
      const oldModel = editor.value.getModel()
      const newModel = monaco.editor.createModel(file.content, language)
      editor.value.setModel(newModel)

      // 销毁旧的 model 以避免内存泄漏
      oldModel?.dispose()
    }
    finally {
      isSettingModel.value = false
    }
  })

  onMounted(() => {
    if (!editorContainer.value) {
      throw new Error('Monaco editor container not found')
    }

    const { editorInitOptions } = setupMonaco()
    editorInstance = monaco.editor.create(editorContainer.value, editorInitOptions)
    editor.value = editorInstance

    // 监听编辑器内容变化
    editorInstance.onDidChangeModelContent(async () => {
      console.log('onDidChangeModelContent')
      if (!editor.value || !store.activeFile.value)
        return

      const content = editor.value.getValue()
      debouncedUpdate(content)
    })
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
