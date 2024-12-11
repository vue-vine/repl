/* eslint-disable prefer-template */

import type { DirectoryNode, FileSystemTree } from '@webcontainer/api'
import { useProjectFileStore } from '@/stores/project-file'
import { isDirectoryNode, isFileNode } from '@/tools/convert-to-file-map'

function FileTreeNode(
  props: {
  name: string
  node: FileSystemTree[string]
  path: string
  },
) {
  const isDirectory = isDirectoryNode(props.node)
  const isExpanded = ref(true)

  // 处理文件点击
  const handleFileClick = () => {
    // TODO: 设置当前活动文件
  }

  // 处理目录展开/收起
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
  }

  return vine`
    <div class="file-tree-node">
      <div
        class="row-flex py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer rounded-md"
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
      class="relative file-tree h-full col-flex flex-shrink-0 border-r border-gray-200 dark:border-gray-800 w-200px overflow-auto"
    >
      <div
        class="sticky top-0 self-stretch p-2 font-bold border-b border-gray-200 dark:border-gray-800 bg-dark-9 z-2"
      >
        项目文件
      </div>
      <div class="p-2 flex-1 flex-shrink-0">
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
