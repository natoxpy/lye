// import { Hash, Milliseconds, UNAME } from '@/utils/units'

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
        },
    ]
}
type Actions = object

export type TimedLinesStore = State & Actions
