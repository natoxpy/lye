import { Milliseconds, Pixels } from '@/app/utils/units'
import * as LocalState from './index'

type TimelineItem = { line: number; right: Milliseconds; left: Milliseconds }

export class Timeline {
    constructor(
        public name: string,
        public unblock: boolean,
        public height: Pixels,
        public items: TimelineItem[] = [
            { line: 1, right: 5_000 as Milliseconds, left: 0 as Milliseconds },
            {
                line: 2,
                right: (7000 + 5_000) as Milliseconds,
                left: 7000 as Milliseconds,
            },
            {
                line: 3,
                right: (14000 + 5_000) as Milliseconds,
                left: 14000 as Milliseconds,
            },
            {
                line: 4,
                right: (21000 + 5_000) as Milliseconds,
                left: 21000 as Milliseconds,
            },
            {
                line: 5,
                right: (28000 + 5_000) as Milliseconds,
                left: 28000 as Milliseconds,
            },
        ]
    ) {}

    public register(line: number, weight: Milliseconds, left: Milliseconds) {
        if (this.items.find((item) => item.line === line) !== undefined) return

        this.items.push({
            line,
            right: weight,
            left,
        })
    }

    getItem(line: number) {
        return this.items.find((i) => i.line == line)
    }

    public update(line: number, left: Milliseconds, right: Milliseconds) {
        const index = this.items.findIndex((i) => i.line == line)
        this.items[index].right = right
        this.items[index].left = left
    }

    public updateLeft(line: number, left: Milliseconds) {
        const index = this.items.findIndex((i) => i.line == line)
        if (index === -1) return
        this.items[index].left = left
    }

    public updateRight(line: number, right: Milliseconds) {
        const index = this.items.findIndex((i) => i.line == line)
        if (index === -1) return
        this.items[index].right = right
    }
}

export type State = {
    boardManager: {
        timelines: Timeline[]
        offset: { ms: Milliseconds; px: Pixels }
        width: { ms: Milliseconds; px: Pixels }
        area: Pixels
        tickLength: Milliseconds
        inbetweenTicks: number
    }
}

export type Actions =
    | LocalState.Action<
          'register',
          { name: string; unblock: boolean; height: Pixels }
      >
    | LocalState.Action<'boardSpecs/width', { ms: Milliseconds; px: Pixels }>
    | LocalState.Action<'boardSpecs/offset', { ms: Milliseconds; px: Pixels }>
    | LocalState.Action<'boardSpecs/area', Pixels>
    | LocalState.Action<'boardSpecs/tickLength', Milliseconds>
    | LocalState.Action<'boardSpecs/inbetweenTicks', number>

export function reducer(draft: LocalState.State, actions: LocalState.Actions) {
    switch (actions.type) {
        case 'boardSpecs/area':
            draft.boardManager.area = actions.payload
            break
        case 'boardSpecs/offset':
            draft.boardManager.offset.ms = actions.payload.ms
            draft.boardManager.offset.px = actions.payload.px
            break
        case 'boardSpecs/width':
            draft.boardManager.width.ms = actions.payload.ms
            draft.boardManager.width.px = actions.payload.px
            break
        case 'boardSpecs/tickLength':
            draft.boardManager.tickLength = actions.payload
            break
        case 'boardSpecs/inbetweenTicks':
            draft.boardManager.inbetweenTicks = actions.payload
            break
        case 'register':
            if (
                new Set(draft.boardManager.timelines.map((v) => v.name)).has(
                    actions.payload.name
                )
            )
                return

            draft.boardManager.timelines.push(
                new Timeline(
                    actions.payload.name,
                    actions.payload.unblock,
                    actions.payload.height
                )
            )
            break
        default:
            break
    }
    return draft
}

export function useTimeline(name: string) {
    const state = LocalState.useState()
    return state.boardManager.timelines.find((t) => t.name == name)
}

export function useBoardManager() {
    const state = LocalState.useState()
    const dispatch = LocalState.useDispatch()

    return {
        tickLength: state.boardManager.tickLength,
        inbetweenTicks: state.boardManager.inbetweenTicks,
        timelines: state.boardManager.timelines,
        area: state.boardManager.area,
        width: {
            ms: state.boardManager.width.ms,
            px: state.boardManager.width.px,
        },
        offset: {
            ms: state.boardManager.offset.ms,
            px: state.boardManager.offset.px,
        },
        getTimeline: (name: string) => {
            return state.boardManager.timelines.find((tl) => tl.name === name)
        },
        setOffset: (ms: Milliseconds, px: Pixels) => {
            dispatch({
                type: 'boardSpecs/offset',
                payload: { ms, px },
            })
        },
        setWidth: (ms: Milliseconds, px: Pixels) => {
            dispatch({
                type: 'boardSpecs/width',
                payload: { ms, px },
            })
        },
        setArea: (px: Pixels) => {
            dispatch({
                type: 'boardSpecs/area',
                payload: px,
            })
        },
        registerTimeline: (
            name: string,
            config: {
                visible?: boolean
                unblock?: boolean
                height: Pixels
            } = {
                height: 64 as Pixels,
            }
        ) => {
            dispatch({
                type: 'register',
                payload: {
                    name,
                    unblock: config.unblock ?? true,
                    height: config.height,
                },
            })
        },
    }
}
