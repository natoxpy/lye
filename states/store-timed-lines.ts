// import { Hash, Milliseconds, UNAME } from '@/utils/units'
import { createStore } from 'zustand'

type Line = {
    hash: number
}

type LineCache = {
    id: number
    number: number
}

type State = {
    workspaces: [
        {
            lineMap: Record<number, Line>
            cacheMap: LineCache[]
            workspace: string
        }
    ]
}
type Actions = object

export type TimedLinesStore = State & Actions

export const timedLinesStore = createStore<TimedLinesStore>()((set) => ({
    workspaces: [
        // {
        //     workspace: '50685e09',
        //     lineMap: {},
        //     cacheMap: [],
        // },
    ],
}))
