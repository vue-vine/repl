import type { DirectoryNode, FileNode, FileSystemTree, SymlinkNode } from '@webcontainer/api'

const WORKING_DIR = '/home/vue-vine-playground'

export function isDirectoryNode(node: any): node is DirectoryNode {
  return Object.getOwnPropertyNames(node).includes('directory')
}
export function isFileNode(node: any): node is FileNode {
  return (
    Object.getOwnPropertyNames(node).includes('file')
    && Object.getOwnPropertyNames(node.file).includes('contents')
  )
}
export function isSymlinkNode(node: any): node is SymlinkNode {
  return (
    Object.getOwnPropertyNames(node).includes('symlink')
    && Object.getOwnPropertyNames(node.file).includes('symlink')
  )
}

export function convertToPlainFileMap(tree: FileSystemTree): Map<string, string> {
  const fileMap = new Map<string, string>()

  function traverse(node: FileSystemTree, path = '') {
    for (const [name, value] of Object.entries(node)) {
      const currentPath = path ? `${path}/${name}` : name

      if (isDirectoryNode(value)) {
        traverse(value.directory, currentPath)
        return
      }

      if (isFileNode(value)) {
        fileMap.set(currentPath, String(value.file.contents))
        return
      }

      if (isSymlinkNode(value)) {
        fileMap.set(currentPath, value.file.symlink)
      }
    }
  }

  traverse(tree, WORKING_DIR)
  return fileMap
}
