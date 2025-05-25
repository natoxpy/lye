import { Milliseconds } from '@/utils/units'
import { createStore } from 'zustand'

type State = {
    frame: number
    offset: Milliseconds
    duration: Milliseconds
    maxwidth: number
}

type Actions = {
    setOffset: (scroll: number | Milliseconds) => void
    changeOffset: (scrollDelta: number | Milliseconds) => void
    setDuration: (duration: number | Milliseconds) => void
    setMaxwidth: (maxwidth: number) => void
    setFrame: (frame: number) => void
    setFrameFromDuration: (duration: number) => void
}

export type SynchronizerStore = State & Actions

export const synchronizerStore = createStore<SynchronizerStore>()((set) => ({
    frame: 0,
    offset: 10_000 as Milliseconds,
    duration: (1000 * 60 * 4) as Milliseconds,
    maxwidth: 4000,
    setOffset: (offset: number | Milliseconds) =>
        set(() => {
            return {
                offset: offset as Milliseconds,
            }
        }),
    setDuration: (duration) => set({ duration: duration as Milliseconds }),
    setMaxwidth: (maxwidth) => set({ maxwidth }),
    setFrame(frame) {
        set({ frame })
    },

    setFrameFromDuration(duration) {
        set((store) => {
            const width = (duration / store.duration) * store.maxwidth

            return {
                frame: width,
            }
        })
    },

    changeOffset: (scrollDelta: number | Milliseconds) => {
        set((state) => {
            const frameDuration =
                (state.frame / state.maxwidth) * state.duration

            let offset = (state.offset + scrollDelta) as Milliseconds
            if (offset < 0) offset = 0 as Milliseconds
            if (offset > state.duration - frameDuration)
                offset = (state.duration - frameDuration) as Milliseconds

            return {
                offset,
            }
        })
    },
}))
