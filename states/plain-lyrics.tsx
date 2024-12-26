import { HEADER_PREFIX } from '@/app/components/editor'
import { UNAME } from '@/utils/units'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type PlainLyrics = {
    id: UNAME
    workspace: UNAME
    content: string
}

type PlainLyricsState = {
    lyrics: PlainLyrics[]
}

type PlainLyricsActions = {
    actions: {
        updateLyrics: (workspace: UNAME, content: string) => void
        createLyrics: (id: UNAME, workspace: UNAME, content: string) => void
    }
}

type PlainLyricsStore = PlainLyricsState & PlainLyricsActions

export const usePlainLyrics = create<PlainLyricsStore>()(
    immer((set) => ({
        lyrics: [],
        actions: {
            createLyrics(id, workspace, content) {
                set((state) => {
                    if (state.lyrics.find((i) => i.id === id)) return

                    state.lyrics.push({
                        id,
                        workspace,
                        content,
                    })
                })
            },
            updateLyrics(workspace, content) {
                set((state) => {
                    const idx = state.lyrics.findIndex(
                        (i) => i.workspace === workspace
                    )
                    if (idx == -1) return
                    state.lyrics[idx].content = content
                })
            },
        },
    }))
)

export function usePlainLyricsWorkspace(workspace: UNAME) {
    const lyrics = usePlainLyrics((state) => state.lyrics).find(
        (lyrics) => lyrics.workspace === workspace
    )

    if (!lyrics) return [''] // error handle this later

    return lyrics.content.split('\n')
}

///
/// Returns all the lyrics without the headers, to get everything with headers use `usePlainLyricsWorkspace`
///
export function usePlainLyricsLinesWorkspace(workspace: UNAME) {
    const lyrics = usePlainLyrics((state) => state.lyrics).find(
        (lyrics) => lyrics.workspace === workspace
    )

    if (!lyrics) return [''] // error handle this later

    return lyrics.content
        .split('\n')
        .filter((a) => !a.startsWith(HEADER_PREFIX))
}
