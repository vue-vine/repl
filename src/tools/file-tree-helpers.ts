import type { DirectoryNode, FileNode, SymlinkNode } from '@webcontainer/api'

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
