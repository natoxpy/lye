import { useStore } from 'zustand'

import { hashRandom } from '@/utils/hash'

import { workspacesStore, WorkspaceStore } from './store-workspaces'
import { Lyrics, lyricsStore, LyricsStore } from './store-lyrics'

// import { timedLinesStore } from './store-timed-lines'
import { plainLyricsStore, PlainLyricsStore } from './store-plain-lyrics'
import {
    sectionedLyricsStore,
    SectionedLyricsStore,
} from './store-sectioned-lyrics'
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

// export const useTimedLinesStore = create(() => timedLinesStore)

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
    const wp = lyrics.find((w) => w.workspace == workspace)

    if (!wp) return {} as never

    return {
        findNearestNeighbors: (targetId: string) => {
            let previous = null
            let current = null
            let next = null

            for (let i = 0; i < wp.lyrics.length; i++) {
                const sections = wp.lyrics[i]
                if (next != null) break

                for (let y = 0; y < sections.content.length; y++) {
                    const line = sections.content[y]

                    if (current != null) {
                        next = line
                        break
                    }

                    if (line.id == targetId) {
                        current = line
                        continue
                    }

                    previous = line
                }
            }

            return {
                previous,
                next,
            }
        },
    }
}
