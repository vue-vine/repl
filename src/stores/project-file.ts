import type { FileSystemTree } from '@webcontainer/api'
import { defineStore } from '../tools/define-store'

export interface FileDescriptor {
  path: string
  content: string
}

export interface ProjectFileStore {
  fileMap: Ref<Map<string, string> | undefined>
  fileTree: Ref<FileSystemTree | undefined>
  activeFile: Ref<FileDescriptor | undefined>
  isTerminalPrepared: Ref<boolean>
  setActiveFile: (path: string) => void
}

export const {
  initStore: initProjectFileStore,
  useStore: useProjectFileStore,
} = defineStore<ProjectFileStore>(
  'project-file-store',
  () => {
    const fileMap = ref<Map<string, string>>()
    const fileTree = ref<FileSystemTree>()
    const activeFile = ref<FileDescriptor>()
    const isTerminalPrepared = ref(false)

    const setActiveFile = (path: string) => {
      const content = fileMap.value?.get(path)
      if (content) {
        activeFile.value = {
          path,
          content,
        }
      }
    }

    return {
      fileMap,
      fileTree,
      activeFile,
      isTerminalPrepared,
      setActiveFile,
    }
  },
)
