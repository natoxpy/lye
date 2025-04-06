import { HEADER_PREFIX } from '@/app/components/editor'
import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { addPlainlines, deletePlainlines } from './persistance'

export type PlainLyrics = {
    id: UNAME
    workspace: UNAME
    content: string
}

type PlainLyricsState = {
    lyrics: PlainLyrics[]
}

type PlainLyricsActions = {
    actions: {
        add: (workspace: UNAME, content?: string) => void
        delete: (workspace: UNAME) => void
        setPlainLyrics: (plainLyrics: PlainLyrics[]) => void
        updateLyrics: (workspace: UNAME, content: string) => void
        createLyrics: (id: UNAME, workspace: UNAME, content: string) => void
    }
}

export type PlainLyricsStore = PlainLyricsState & PlainLyricsActions

export const plainLyricsStore = createStore<PlainLyricsStore>()((set) => ({
    lyrics: [],
    actions: {
        add(workspace, content) {
            set((state) => {
                const id = crypto.randomUUID()

                const obj = {
                    workspace: workspace,
                    content: content ?? '',
                    id: id as UNAME,
                }

                addPlainlines(obj)
                state.lyrics.push(obj)
                return state
            })
        },
        delete(workspace) {
            set((state) => {
                const lyric = state.lyrics.find((l) => l.workspace == workspace)
                if (!lyric) return state

                deletePlainlines(lyric.id)

                state.lyrics = state.lyrics.filter(
                    (l) => l.workspace != workspace
                )

                return state
            }, true)
        },
        setPlainLyrics(plainLyrics) {
            set((state) => {
                state.lyrics = plainLyrics
                return state
            }, true)
        },
        createLyrics(id, workspace, content) {
            set((state) => {
                if (state.lyrics.find((i) => i.id === id)) return state

                state.lyrics.push({
                    id,
                    workspace,
                    content,
                })

                return state
            })
        },
        updateLyrics(workspace, content) {
            set((state) => {
                const idx = state.lyrics.findIndex(
                    (i) => i.workspace === workspace
                )

                if (idx == -1) return state
                state.lyrics[idx].content = content

                return state
            })
        },
    },
}))

export function usePlainLyricsWorkspace(workspace: UNAME) {
    const lyrics = plainLyricsStore
        .getState()
        .lyrics.find((lyrics) => lyrics.workspace === workspace)

    //if (!lyrics) return [HEADER_PREFIX + 'Verse', ''] // error handle this later

    if (!lyrics) return null

    return lyrics.content.split('\n')
}

export function getPlainLyricsCount(lyrics: string): number {
    return lyrics.split('\n').filter((a) => !a.startsWith(HEADER_PREFIX)).length
}

///
/// Returns all the lyrics without the headers, to get everything with headers use `usePlainLyricsWorkspace`
///
export function usePlainLyricsLinesWorkspace(workspace: UNAME) {
    const lyrics = plainLyricsStore
        .getState()
        .lyrics.find((lyrics) => lyrics.workspace === workspace)

    if (!lyrics) return [] // error handle this later

    return lyrics.content
        .split('\n')
        .filter((a) => !a.startsWith(HEADER_PREFIX))
}
