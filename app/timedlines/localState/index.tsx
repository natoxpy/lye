export { useCacheState, useCacheDispatch } from './cache'
export { useEditorState, useEditorDispatch } from './editor'
import { LocalCacheProvider } from './cache'
import { LocalEditorProvider } from './editor'

import EditorInternalStore from '../timeline/FocusView/internalState'

export function LocalStoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LocalCacheProvider>
                <LocalEditorProvider>
                    <InternalStoresProvider>{children}</InternalStoresProvider>
                </LocalEditorProvider>
            </LocalCacheProvider>
        </>
    )
}

export function InternalStoresProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <EditorInternalStore>{children}</EditorInternalStore>
        </>
    )
}
