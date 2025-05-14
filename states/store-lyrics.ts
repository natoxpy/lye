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
            delete() {
                set(() => {})
            },
        },
    }))
)
