import { UHash } from '@/app/cachedb'
import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { mouseActivityReducer } from './mouseActivity/reducer'

export type Line = {
    start: number
    end: number
    line: number
    displayLine: number
    uhash: UHash
    timeline: 'primary' | 'secondary'
}

export type MouseActivities = 'idle' | 'resize-left' | 'resize-right' | 'move'

export type State = {
    lines: Line[]
    player: {
        duration?: number
        currentTime?: number
        paused?: boolean
    }
    root: {
        width?: number
        childWidth?: number
    }
    editor: {
        mouse: {
            activity: MouseActivities
            target: UHash | null
            absolutePosition: { x: number; y: number }
            positionRelativeToTarget: { x: number; y: number }
        }
    }
}
export type Action =
    | { type: 'player/duration/update'; payload: number }
    | { type: 'player/currentTime/update'; payload: number }
    | { type: 'player/paused/update'; payload: boolean }
    | { type: 'root/width/update'; payload?: number }
    | { type: 'root/childWidth/update'; payload?: number }
    | { type: 'lines/load'; payload: Line[] }
    | { type: 'editor/mouse/activity/update'; payload: MouseActivities }
    | { type: 'editor/mouse/target/update'; payload: UHash | null }
    | { type: 'editor/mouse/absolutePosition/update'; payload: { x: number; y: number } }
    | { type: 'editor/mouse/positionRelativeToTarget/update'; payload: { x: number; y: number } }
    | { type: 'editor/mouse/activity/tick' }

export const Context = createContext<State>({} as unknown as State)
export const DispatchContext = createContext<Dispatch<Action>>(null as unknown as Dispatch<Action>)

export default function InternalStateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        lines: [],
        player: {
            duration: 0,
            currentTime: 0,
            paused: true
        },
        root: {},
        editor: {
            mouse: {
                activity: 'idle',
                target: null,
                absolutePosition: { x: 0, y: 0 },
                positionRelativeToTarget: { x: 0, y: 0 }
            }
        }
    } satisfies State)

    return (
        <Context.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </Context.Provider>
    )
}

function reducer(prevState: State, action: Action): State {
    const state = structuredClone(prevState)

    switch (action.type) {
        case 'player/duration/update':
            state.player.duration = action.payload * 1000
            break
        case 'player/currentTime/update':
            state.player.currentTime = action.payload * 1000
            break
        case 'player/paused/update':
            state.player.paused = action.payload
            break
        case 'lines/load':
            state.lines = action.payload
            break
        case 'root/childWidth/update':
            state.root.childWidth = action.payload
            break
        case 'root/width/update':
            state.root.width = action.payload
            break
        case 'editor/mouse/activity/update':
        case 'editor/mouse/target/update':
        case 'editor/mouse/absolutePosition/update':
        case 'editor/mouse/activity/tick':
        case 'editor/mouse/positionRelativeToTarget/update':
            mouseActivityReducer(state, action)
            break
    }

    return state
}

export const useInternalState = () => useContext(Context)
export const useInternalSelector = <T,>(cb: (state: State) => T = (state) => state as T) =>
    cb(useInternalState())
export const useInternalDispatch = () => useContext(DispatchContext)
