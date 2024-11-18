import { Milliseconds, Pixels } from '@/app/utils/units'
import * as LocalState from './index'

export type Timeline = {
    name: string
    visible: boolean
    unblock: boolean
}

export type State = {
    boardManager: {
        timelines: Timeline[]
        offset: { ms: Milliseconds; px: Pixels }
        width: { ms: Milliseconds; px: Pixels }
        area: Pixels
    }
}

export type Actions =
    | LocalState.Action<'register', Timeline>
    | LocalState.Action<'boardSpecs/width', { ms: Milliseconds; px: Pixels }>
    | LocalState.Action<'boardSpecs/offset', { ms: Milliseconds; px: Pixels }>
    | LocalState.Action<'boardSpecs/area', Pixels>

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
            config: { visible?: boolean; unblock?: boolean } = {}
        ) => {
            dispatch({
                type: 'register',
                payload: {
                    name,
                    visible: config.visible ?? true,
                    unblock: config.unblock ?? true,
                },
            })
        },
    }
}
