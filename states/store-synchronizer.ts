import { Milliseconds } from '@/utils/units'
import { createStore } from 'zustand'

type State = {
    frame: {
        width: number
        duration: Milliseconds
    }
    offset: Milliseconds
    offsetPx: number
    duration: Milliseconds
    maxwidth: number
}
type Actions = {
    setOffset: (scroll: number | Milliseconds) => void
    setDuration: (duration: number | Milliseconds) => void
    setFrame: (frame: { width: number; duration: Milliseconds }) => void
    changeOffset: (scrollDelta: number | Milliseconds) => void
}

export type SynchronizerStore = State & Actions

export const synchronizerStore = createStore<SynchronizerStore>()((set) => ({
    frame: {
        width: 0,
        duration: 0 as Milliseconds,
    },
    offset: 0 as Milliseconds,
    offsetPx: 0,
    duration: (1000 * 60 * 3) as Milliseconds,
    maxwidth: 4000,
    setOffset: (offset: number | Milliseconds) =>
        set((state) => ({
            offset: offset as Milliseconds,
            offsetPx: state.maxwidth * ((offset - 1000 * 10) / state.duration),
        })),
    setDuration: (duration) => set({ duration: duration as Milliseconds }),
    setFrame: (frame) => set({ frame }),
    changeOffset: (scrollDelta: number | Milliseconds) => {
        set((state) => {
            let offset = (state.offset + scrollDelta) as Milliseconds
            if (offset < 0) offset = 0 as Milliseconds
            if (offset > state.duration - state.frame.duration)
                offset = (state.duration - state.frame.duration) as Milliseconds

            return {
                offset,
                offsetPx: state.maxwidth * (offset / state.duration),
            }
        })
    },
}))
