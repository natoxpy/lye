export { useCacheState, useCacheDispatch } from './cache'
export { useEditorState, useEditorDispatch } from './editor'
import { LocalCacheProvider } from './cache'
import { LocalEditorProvider } from './editor'

export default function LocalStoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LocalCacheProvider>
                <LocalEditorProvider>{children}</LocalEditorProvider>
            </LocalCacheProvider>
        </>
    )
}
