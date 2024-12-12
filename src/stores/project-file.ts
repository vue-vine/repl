import type { FileNode, FileSystemTree } from '@webcontainer/api'
import { defineStore } from '../tools/define-store'

export interface FileDescriptor {
  path: string
  content: string
}

export interface ProjectFileStore {
  fileTree: Ref<FileSystemTree | undefined>
  activeFile: Ref<FileDescriptor | undefined>
  isTerminalPrepared: Ref<boolean>
  setActiveFile: (path: string, node: FileNode) => void
  updateFileContent: (path: string, content: string) => Promise<void>
}

export const {
  initStore: initProjectFileStore,
  useStore: useProjectFileStore,
} = defineStore<ProjectFileStore>(
  'project-file-store',
  () => {
    const fileTree = ref<FileSystemTree>()
    const activeFile = ref<FileDescriptor>()
    const isTerminalPrepared = ref(false)

    const setActiveFile = (
      path: string,
      node: FileNode,
    ) => {
      activeFile.value = {
        path,
        content: String(node.file.contents),
      }
    }

    const updateFileContent = async (path: string, content: string) => {
      if (activeFile.value?.path === path) {
        activeFile.value.content = content
      }

      await nextTick()
      await window.sandbox?.writeFile(path, content)
    }

    return {
      fileTree,
      activeFile,
      isTerminalPrepared,
      setActiveFile,
      updateFileContent,
    }
  },
)
