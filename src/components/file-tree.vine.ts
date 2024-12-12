/* eslint-disable prefer-template */

import type { DirectoryNode, FileSystemTree } from '@webcontainer/api'
import { useProjectFileStore } from '@/stores/project-file'
import { isDirectoryNode, isFileNode } from '@/tools/file-tree-helpers'

function FileTreeNode(
  props: {
  name: string
  node: FileSystemTree[string]
  path: string
  },
) {
  const store = useProjectFileStore()
  const isDirectory = isDirectoryNode(props.node)
  const isExpanded = ref(true)

  // 处理文件点击
  const handleFileClick = () => {
    if (
      !isFileNode(props.node) // Skip when clicking on a symlink
      || store.activeFile?.value?.path === props.path // Skip when opening the same file
    ) {
      return
    }

    store.setActiveFile(props.path, props.node)
  }

  // 处理目录展开/收起
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
  }

  const isActive = computed(() => {
    return store.activeFile?.value?.path === props.path
  })

  return vine`
    <div class="file-tree-node select-none">
      <div
        class="row-flex py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer rounded-md"
        :class="{
          'bg-gray-800': isActive,
        }"
        @click="isDirectory ? toggleExpand() : handleFileClick()"
      >
        <div class="mr-1">
          <div
            v-if="isDirectory"
            class="i-material-symbols:folder-open-rounded"
          />
          <div v-else class="i-solar:document-text-bold" />
        </div>
        <span class="whitespace-nowrap overflow-hidden text-ellipsis">
          {{ name }}
        </span>
      </div>

      <div
        v-if="isDirectory && isExpanded"
        class="ml-4 pl-2 border-l dark:border-gray-500:50 border-solid border-l-1"
      >
        <template
          v-for="(childNode, childName) in (node as DirectoryNode).directory"
        >
          <FileTreeNode
            :name="(childName as string)"
            :node="childNode"
            :path="path + '/' + childName"
          />
        </template>
      </div>
    </div>
  `
}

export function FileTree() {
  const { fileTree } = useProjectFileStore()

  return vine`
    <div
      class="relative file-tree h-full col-flex flex-shrink-0 border-r border-gray-200 dark:border-gray-800 w-240px overflow-auto"
    >
      <div
        class="sticky top-0 w-full self-stretch p-2 font-jb font-bold border-b border-gray-200 dark:border-gray-800 bg-dark-9 z-2"
      >
        File explorer
      </div>
      <div class="p-2 flex-1 flex-shrink-0 self-stretch">
        <template v-if="fileTree">
          <template v-for="(node, name) in fileTree">
            <FileTreeNode
              :name="(name as string)"
              :node="node"
              :path="(name as string)"
            />
          </template>
        </template>
      </div>
    </div>
  `
}
