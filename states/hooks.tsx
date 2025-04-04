import { create, useStore } from 'zustand'

import { timedLinesStore } from './store-timed-lines'
import { plainLyricsStore, PlainLyricsStore } from './store-plain-lyrics'
import { headerStore, HeaderStore } from './store-header'
import { synchronizerStore, SynchronizerStore } from './store-synchronizer'
import { workspacesStore, WorkspaceStore } from './store-workspaces'
import { UNAME } from '@/utils/units'

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

export const useWorkspaceUtils = () => {
    const workspace = useWorkspaces((state) => state.actions)
    const plainLyrics = usePlainLyrics((state) => state.actions)

    const createEmptyWorkspace = () => {
        const workspace_id = crypto.randomUUID() as UNAME
        const shorthand_id = workspace_id.split('-')[0] as UNAME
        workspace.add(workspace_id, shorthand_id)
        plainLyrics.add(shorthand_id)
    }

    const deleteWorkspace = (id: string, shorthand_id: string) => {
        workspace.delete(id)
        plainLyrics.delete(shorthand_id as UNAME)
    }

    return {
        createEmptyWorkspace,
        deleteWorkspace,
    }
}
