import type { Sandbox } from '@/tools/sandbox'

declare global {
  interface Window {
    sandbox?: Sandbox
  }
}
