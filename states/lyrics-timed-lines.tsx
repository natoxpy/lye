import { Hash, Milliseconds, UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type LyricsTimeMap = {
    id: UNAME
    workspace: UNAME
    timeMap: Record<Hash, { start: Milliseconds; end: Milliseconds }>
}

type LyricsTimedLinesStates = {
    timedMaps: LyricsTimeMap[]
}

type LyricsTimedLinesActions = {
    actions: object
}

type LyricsTimedLines = LyricsTimedLinesStates & LyricsTimedLinesActions

export const useLyricsTimedLines = createStore<LyricsTimedLines>()(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer((_) => ({
        timedMaps: [],
        actions: {},
    }))
)
