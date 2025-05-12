import { create, useStore } from 'zustand'

import { timedLinesStore } from './store-timed-lines'
import { plainLyricsStore, PlainLyricsStore } from './store-plain-lyrics'
import {
    sectionedLyricsStore,
    SectionedLyricsStore,
} from './store-sectioned-lyrics'
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

export const useSectionedLyrics = <T,>(
    selector: (state: SectionedLyricsStore) => T
): T => {
    return useStore(sectionedLyricsStore, selector)
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

export function useSectionedLyricsSections(workspace: string) {
    const wsp = useSectionedLyrics((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )
    if (!wsp) return []
    return wsp.sections
}

export const useSynchronizer = <T,>(
    selector: (state: SynchronizerStore) => T
): T => {
    return useStore(synchronizerStore, selector)
}

export const useWorkspaceUtils = () => {
    const workspaceStore = useWorkspaces((state) => state.actions)
    const plainLyricsStore = usePlainLyrics((state) => state.actions)
    const sectionedLyricsStore = useSectionedLyrics((state) => state.actions)

    const createEmptyWorkspace = () => {
        const workspaceId = crypto.randomUUID() as UNAME
        const shorthandId = workspaceId.split('-')[0] as UNAME
        workspaceStore.add(workspaceId, shorthandId)
        plainLyricsStore.add(shorthandId)
        sectionedLyricsStore.add(shorthandId, [])

        return [workspaceId, shorthandId]
    }

    const deleteWorkspace = (id: string, shorthandId: string) => {
        workspaceStore.delete(id)
        plainLyricsStore.delete(shorthandId as UNAME)
    }

    const createWorkspace = ({
        workspace,
        plainLyrics,
    }: {
        workspace: { title: string; artist: string; album: string }
        plainLyrics: string
        synced?: []
    }) => {
        const workspaceId = crypto.randomUUID() as UNAME
        const shorthandId = workspaceId.split('-')[0] as UNAME

        workspaceStore.add(workspaceId, shorthandId, {
            title: workspace.title,
            meta: { artist: workspace.artist, album: workspace.album },
            fileblob: undefined as never,
            coverblob: undefined as never,
        })

        plainLyricsStore.add(shorthandId, plainLyrics)
        sectionedLyricsStore.add(shorthandId, [])
    }

    return {
        createEmptyWorkspace,
        createWorkspace,
        deleteWorkspace,
    }
}
