import { create, useStore } from 'zustand'

import { timedLinesStore } from './store-timed-lines'
import { plainLyricsStore, PlainLyricsStore } from './store-plain-lyrics'
import { headerStore, HeaderStore } from './store-header'
import { synchronizerStore, SynchronizerStore } from './store-synchronizer'
import { workspacesStore, WorkspaceStore } from './store-workspaces'

export const useTimedLinesStore = create(() => timedLinesStore)

export const usePlainLyrics = <T,>(
    selector: (state: PlainLyricsStore) => T
): T => {
    return useStore(plainLyricsStore, selector)
}

// Create a custom hook with support for selectors
export const useWorkspaces = <T,>(
    selector: (state: WorkspaceStore) => T
): T => {
    return useStore(workspacesStore, selector)
}

export const useHeader = <T,>(selector: (state: HeaderStore) => T): T => {
    return useStore(headerStore, selector)
}

export const useSynchronizer = <T,>(
    selector: (state: SynchronizerStore) => T
): T => {
    return useStore(synchronizerStore, selector)
}
