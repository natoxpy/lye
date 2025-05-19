import { Milliseconds } from '@/utils/units'
import { createStore } from 'zustand'

type State = {
    frame: {
        width: number
        duration: Milliseconds
    }
    offset: Milliseconds
    duration: Milliseconds
    maxwidth: number
    // tickLength: Milliseconds | number
    // inbetweenTicks: number
}
type Actions = {
    setOffset: (scroll: number | Milliseconds) => void
    changeOffset: (scrollDelta: number | Milliseconds) => void
    setDuration: (duration: number | Milliseconds) => void
    setMaxwidth: (maxwidth: number) => void
    setMaxwidthFromDuration: (duration: number | Milliseconds) => void
    setFrame: (frame: { width: number; duration: Milliseconds }) => void
    setFrameFromDuration: (duration: number) => void
}

export type SynchronizerStore = State & Actions

export const synchronizerStore = createStore<SynchronizerStore>()((set) => ({
    frame: {
        width: 0,
        duration: 0 as Milliseconds,
    },
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
    setMaxwidthFromDuration: (duration) =>
        set((store) => ({
            maxwidth: (store.frame.width * store.duration) / duration,
        })),
    setFrame(frame) {
        set({ frame })

        // set(() => {
        //     // const tickwidth =
        //     //     (store.tickLength / store.duration) * store.maxwidth

        //     // const target = 10
        //     // let nearestTarget = 1

        //     // for (let i = 1; i <= 10; i++) {
        //     //     const pk = 1000 * i
        //     //     const jpk = pk / tickwidth

        //     //     console.log(pk / tickwidth)
        //     //     // console.log(2, (1000 * nearestTarget) / tickwidth - target)

        //     //     if (
        //     //         Math.abs(jpk - target) <
        //     //         Math.abs((1000 * nearestTarget) / tickwidth - target)
        //     //     ) {
        //     //         nearestTarget = i
        //     //     }
        //     // }

        //     // console.log((nearestTarget * 1000) / tickwidth)

        //     return { frame }
        // })
    },

    setFrameFromDuration(duration) {
        set((store) => {
            const width = (duration / store.duration) * store.maxwidth

            return {
                frame: {
                    duration: duration as Milliseconds,
                    width,
                },
            }
        })
    },

    changeOffset: (scrollDelta: number | Milliseconds) => {
        set((state) => {
            let offset = (state.offset + scrollDelta) as Milliseconds
            if (offset < 0) offset = 0 as Milliseconds
            if (offset > state.duration - state.frame.duration)
                offset = (state.duration - state.frame.duration) as Milliseconds

            return {
                offset,
            }
        })
    },
}))
