import { inject, provide } from 'vue'

/**
 * @param key store name
 * @param setup store init function
 */
export function defineStore<T>(key: string, setup: () => T) {
  const initStore = () => {
    const storeData = setup()
    provide(key, storeData)

    return storeData
  }

  const useStore = ({
    onComponentSetup,
  }: {
    onComponentSetup?: (state: T) => void
  } = {}) => {
    const storeData = inject(key, {} as T)
    onComponentSetup?.(storeData)
    return storeData
  }

  return {
    initStore,
    useStore,
  }
}
