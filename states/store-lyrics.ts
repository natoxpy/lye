import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { LyricsDatabase } from '@/states/persistance'

export type Line = {
    id: string
    content: string
    timerange?: { start?: number; end?: number }
}

export type LyricsSection = { header: Line; content: Line[] }

export type Lyrics = { id: string; workspace: string; lyrics: LyricsSection[] }

type LyricsState = {
    workspaces: Lyrics[]
}

type LyricsAction = {
    actions: {
        add: (lyrics: Lyrics) => void
        update: (workspace: string, lyrics: LyricsSection[]) => void
        delete: (workspace: string) => void
    }
}

export type LyricsStore = LyricsState & LyricsAction

export const lyricsStore = createStore<LyricsStore>()(
    immer((set) => ({
        workspaces: [],
        actions: {
            add(lyrics) {
                set((store) => {
                    store.workspaces.push(lyrics)
                    LyricsDatabase.add(lyrics)
                })
            },
            update(workspace, lyrics) {
                set((store) => {
                    const index = store.workspaces.findIndex(
                        (v) => v.workspace == workspace
                    )

                    if (index == -1) return

                    store.workspaces[index].lyrics = lyrics
                    LyricsDatabase.update({ ...store.workspaces[index] })
                })
            },
            delete(workspace: string) {
                set((store) => {
                    const lyrics = store.workspaces.find(
                        (l) => l.workspace == workspace
                    )
                    if (lyrics == undefined) return

                    LyricsDatabase.delete(lyrics.id)
                    store.workspaces = store.workspaces.filter(
                        (w) => w.id != lyrics.id
                    )
                })
            },
        },
    }))
)

export function getLyricsCount(lyrics?: LyricsSection[]): number {
    if (!lyrics) return 0
    let acc = 0

    for (let i = 0; i < lyrics.length; i++) {
        for (let y = 0; y < lyrics[i].content.length; y++) {
            acc += 1
        }
    }

    return acc
}
