import { create, useStore } from 'zustand'

import { hashRandom } from '@/utils/hash'

import { workspacesStore, WorkspaceStore } from './store-workspaces'
import { Lyrics, lyricsStore, LyricsStore } from './store-lyrics'

import { timedLinesStore } from './store-timed-lines'
import { plainLyricsStore, PlainLyricsStore } from './store-plain-lyrics'
import {
    sectionedLyricsStore,
    SectionedLyricsStore,
} from './store-sectioned-lyrics'
import { headerStore, HeaderStore } from './store-header'
import { synchronizerStore, SynchronizerStore } from './store-synchronizer'
import { UNAME } from '@/utils/units'

// Create a custom hook with support for selectors
export const useWorkspaces = <T,>(
    selector: (state: WorkspaceStore) => T
): T => {
    return useStore(workspacesStore, selector)
}

export const useLyrics = <T,>(selector: (state: LyricsStore) => T) => {
    return useStore(lyricsStore, selector)
}

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
    const lyricsStore = useLyrics((state) => state.actions)
    // const plainLyricsStore = usePlainLyrics((state) => state.actions)
    // const sectionedLyricsStore = useSectionedLyrics((state) => state.actions)

    const createWorkspace = (
        workspace: { title: string; artist: string; album: string },
        lyrics: Lyrics
    ) => {
        const workspaceId = crypto.randomUUID() as UNAME
        const shorthandId = workspaceId.split('-')[0] as UNAME

        workspaceStore.add(workspaceId, shorthandId, {
            title: workspace.title,
            meta: {
                artist: workspace.artist,
                album: workspace.album,
            },
            coverblob: undefined as never,
            fileblob: undefined as never,
        })
        lyricsStore.add(lyrics)
    }

    const createEmptyWorkspace = () => {
        const workspaceId = crypto.randomUUID() as UNAME
        const shorthandId = workspaceId.split('-')[0] as UNAME

        workspaceStore.add(workspaceId, shorthandId)
        lyricsStore.add({
            workspace: shorthandId,
            id: crypto.randomUUID(),
            lyrics: [
                {
                    header: {
                        content: 'Verse 1',
                        id: hashRandom(),
                    },
                    content: [
                        {
                            content: 'hello world',
                            id: hashRandom(),
                        },
                    ],
                },
            ],
        })
    }

    return {
        createWorkspace,
        createEmptyWorkspace,
        deleteWorkspace: () => {},
    }

    // const createEmptyWorkspace = () => {
    //     const workspaceId = crypto.randomUUID() as UNAME
    //     const shorthandId = workspaceId.split('-')[0] as UNAME
    //     workspaceStore.add(workspaceId, shorthandId)
    //     plainLyricsStore.add(shorthandId)
    //     sectionedLyricsStore.add(shorthandId, [])

    //     return [workspaceId, shorthandId]
    // }

    // const deleteWorkspace = (id: string, shorthandId: string) => {
    //     workspaceStore.delete(id)
    //     // plainLyricsStore.delete(shorthandId as UNAME)
    // }

    // const createWorkspace = ({
    //     workspace,
    //     plainLyrics,
    // }: {
    //     workspace: { title: string; artist: string; album: string }
    //     plainLyrics: string
    //     synced?: []
    // }) => {
    //     const workspaceId = crypto.randomUUID() as UNAME
    //     const shorthandId = workspaceId.split('-')[0] as UNAME

    //     workspaceStore.add(workspaceId, shorthandId, {
    //         title: workspace.title,
    //         meta: { artist: workspace.artist, album: workspace.album },
    //         fileblob: undefined as never,
    //         coverblob: undefined as never,
    //     })

    //     plainLyricsStore.add(shorthandId, plainLyrics)
    //     sectionedLyricsStore.add(shorthandId, [])
    // }
}
