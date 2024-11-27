import type { FileSystemTree } from '@webcontainer/api'
import { defineStore } from '../tools/define-store'

export interface FileDescriptor {
  path: string
  content: string
}
export interface ProjectFileStore {
  fileTree: Ref<FileSystemTree | undefined>
  activeFile: Ref<FileDescriptor | undefined>
  isTerminalPrepared: Ref<boolean>
}

export const {
  initStore: initProjectFileStore,
  useStore: useProjectFileStore,
} = defineStore<ProjectFileStore>(
  'project-file-store',
  () => {
    return {
      fileTree: ref(undefined),
      activeFile: ref(undefined),
      isTerminalPrepared: ref(false),
    }
  },
)
