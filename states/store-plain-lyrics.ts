import { HEADER_PREFIX } from '@/app/components/editor'
import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { addPlainlines } from './persistance'

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
        add: (workspace: UNAME) => void
        setPlainLyrics: (plainLyrics: PlainLyrics[]) => void
        updateLyrics: (workspace: UNAME, content: string) => void
        createLyrics: (id: UNAME, workspace: UNAME, content: string) => void
    }
}

export type PlainLyricsStore = PlainLyricsState & PlainLyricsActions

export const plainLyricsStore = createStore<PlainLyricsStore>()((set) => ({
    lyrics: [
        // {
        //     id: 'e5d1d5b9-4141-4797-a34e-0f53a914c4b9' as UNAME,
        //     content: 'Iron Lotus Lyrics',
        //     workspace: '50685e09' as UNAME,
        // },
        // {
        //     id: '3bd43f69-d9d0-4715-bdaf-df6a45bbb183' as UNAME,
        //     content: 'In Hell We Live, Lament Lyrics',
        //     workspace: 'f122e5d2' as UNAME,
        // },
        // {
        //     id: 'b5cc0d74-9d4f-4c21-b3ce-4407e2816985' as UNAME,
        //     content: "Grown-up's paradise Lyrics",
        //     workspace: '098cf7e1' as UNAME,
        // },
    ],
    actions: {
        add(workspace) {
            set((state) => {
                const obj = {
                    'workspace': workspace,
                    'content': '',
                    'id': workspace
                };

                addPlainlines(obj);
                state.lyrics.push(obj);
                return state;
            })

        },
        setPlainLyrics(plainLyrics) {
            set((state) => {
                state.lyrics = plainLyrics;
                return state;
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

/*
export const usePlainLyrics = create<PlainLyricsStore>()(
    immer((set) => ({
        lyrics: [
            {
                id: 'e5d1d5b9-4141-4797-a34e-0f53a914c4b9' as UNAME,
                content: 'Iron Lotus Lyrics',
                workspace: '50685e09' as UNAME,
            },
            // {
            //     id: '3bd43f69-d9d0-4715-bdaf-df6a45bbb183' as UNAME,
            //     content: 'In Hell We Live, Lament Lyrics',
            //     workspace: 'f122e5d2' as UNAME,
            // },
            // {
            //     id: 'b5cc0d74-9d4f-4c21-b3ce-4407e2816985' as UNAME,
            //     content: "Grown-up's paradise Lyrics",
            //     workspace: '098cf7e1' as UNAME,
            // },
        ],
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
    */

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

    if (!lyrics) return undefined // error handle this later

    return lyrics.content
        .split('\n')
        .filter((a) => !a.startsWith(HEADER_PREFIX))
}
