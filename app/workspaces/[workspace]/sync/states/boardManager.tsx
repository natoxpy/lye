import { Milliseconds, Pixels } from '@/app/utils/units'
import * as LocalState from './index'

export type Timeline = {
    name: string
    visible: boolean
    unblock: boolean
    height: Pixels
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
    | LocalState.Action<'register', Timeline>
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

            draft.boardManager.timelines.push(actions.payload)
            break
        default:
            break
    }
    return draft
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
                    visible: config.visible ?? true,
                    unblock: config.unblock ?? true,
                    height: config.height,
                },
            })
        },
    }
}
