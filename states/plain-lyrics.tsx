import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
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
    actions: object
}

type PlainLyricsStore = PlainLyricsState & PlainLyricsActions

export const usePlainLyrics = createStore<PlainLyricsStore>()(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer((_) => ({
        lyrics: [],
        actions: {},
    }))
)
