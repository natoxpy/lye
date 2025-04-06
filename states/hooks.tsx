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
    const workspaceStore = useWorkspaces((state) => state.actions)
    const plainLyricsStore = usePlainLyrics((state) => state.actions)

    const createEmptyWorkspace = () => {
        const workspace_id = crypto.randomUUID() as UNAME
        const shorthand_id = workspace_id.split('-')[0] as UNAME
        workspaceStore.add(workspace_id, shorthand_id)
        plainLyricsStore.add(shorthand_id)

        return [workspace_id, shorthand_id]
    }

    const deleteWorkspace = (id: string, shorthand_id: string) => {
        workspaceStore.delete(id)
        plainLyricsStore.delete(shorthand_id as UNAME)
    }

    const createWorkspace = ({
        workspace,
        plainLyrics,
    }: {
        workspace: { title: string; artist: string; album: string }
        plainLyrics: string
        synced?: []
    }) => {
        const workspace_id = crypto.randomUUID() as UNAME
        const shorthand_id = workspace_id.split('-')[0] as UNAME

        workspaceStore.add(workspace_id, shorthand_id, {
            title: workspace.title,
            meta: { artist: workspace.artist, album: workspace.album },
            fileblob: undefined as never,
            coverblob: undefined as never,
        })

        plainLyricsStore.add(shorthand_id, plainLyrics)
    }

    return {
        createEmptyWorkspace,
        createWorkspace,
        deleteWorkspace,
    }
}
