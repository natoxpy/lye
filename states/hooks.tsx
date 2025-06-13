import { useStore } from 'zustand'

import { hashRandom } from '@/utils/hash'

import { workspacesStore, WorkspaceStore } from './store-workspaces'
import { Lyrics, lyricsStore, LyricsStore } from './store-lyrics'

import { headerStore, HeaderStore } from './store-header'
import { synchronizerStore, SynchronizerStore } from './store-synchronizer'
import { UNAME } from '@/utils/units'
import { lineSyncStore, LineSyncStore } from './store-line-sync'

// Create a custom hook with support for selectors
export const useWorkspaces = <T,>(
    selector: (state: WorkspaceStore) => T
): T => {
    return useStore(workspacesStore, selector)
}

export const useLyrics = <T,>(selector: (state: LyricsStore) => T) => {
    return useStore(lyricsStore, selector)
}

export const useLineSync = <T,>(selector: (state: LineSyncStore) => T) => {
    return useStore(lineSyncStore, selector)
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
    const lyricsStore = useLyrics((state) => state.actions)
    const lineSyncStore = useLineSync((state) => state.actions)

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
        lineSyncStore.add({
            content: [],
            workspace: shorthandId,
            id: crypto.randomUUID(),
        })
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
                        content: '',
                        id: hashRandom(),
                    },
                    content: [],
                },
            ],
        })
        lineSyncStore.add({
            content: [],
            workspace: shorthandId,
            id: crypto.randomUUID(),
        })
    }

    return {
        createWorkspace,
        createEmptyWorkspace,
        deleteWorkspace: (workspaceId: string, shorthandId: string) => {
            workspaceStore.delete(workspaceId)
            lyricsStore.delete(shorthandId)
            lineSyncStore.delete(shorthandId)
        },
    }
}

export function useLyricsToolkit(workspace: string) {
    const lyrics = useLyrics((state) => state.workspaces)
    const syncs = useLineSync((state) => state.workspaces)

    const wp = lyrics.find((w) => w.workspace == workspace)
    const ls = syncs.find((w) => w.workspace == workspace)

    if (!wp || !ls) return {} as never

    return {
        findNearestNeighbors: (targetId: string) => {
            let previous = null
            let next = null

            const list = wp.lyrics
                .flatMap((v) => v.content)
                .filter((lyric) => {
                    return (
                        ls.content.findIndex((c) => c.targetId == lyric.id) !=
                        -1
                    )
                })

            const targetIndex = list.findIndex((v) => v.id == targetId)
            if (targetIndex == -1) return { previous, next }

            if (targetIndex + 1 < list.length - 1) {
                next = list[targetIndex + 1]
            }

            if (list.length > 0) {
                previous = list[targetIndex - 1]
            }

            return {
                previous,
                next,
            }
        },
    }
}
