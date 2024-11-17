import { Milliseconds } from '@/app/utils/units'
import * as LocalState from './index'

export type Timeline = {
    name: string
    visible: boolean
    unblock: boolean
}

export type State = {
    boardManager: {
        timelines: Timeline[]
        offset: Milliseconds
        width: Milliseconds
    }
}

export type Actions =
    | LocalState.Action<'register', Timeline>
    | LocalState.Action<'boardSpecs/width', { width: Milliseconds }>
    | LocalState.Action<'boardSpecs/offset', { offset: Milliseconds }>

export function reducer(draft: LocalState.State, actions: LocalState.Actions) {
    switch (actions.type) {
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
        width: state.boardManager.width,
        offset: state.boardManager.offset,
        setOffset: (offset: Milliseconds) => {
            dispatch({
                type: 'boardSpecs/offset',
                payload: { offset },
            })
        },
        setWidth: (width: Milliseconds) => {
            dispatch({
                type: 'boardSpecs/width',
                payload: { width },
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
