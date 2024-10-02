import { ActivityTickReducer } from './activityTick'
import { dividersReducer } from './dividers'
import { createContext, Dispatch, useContext, useReducer } from 'react'

export type DividerIndex = number
export type MouseActivities = 'move' | 'idle'
export type Divider = { time: number; leftOffset: number }
export type PageOptions = 'dividerEditor' | 'dividerSpacing'
export type DividerSlice = { content: string; fillRatio: number }

export type State = {
    lyric?: string
    page: {
        state: PageOptions
        width: number
        zoom: number
        root: {
            left: number
        }
    }
    dividers: Divider[]
    slices: DividerSlice[]
    mouse: {
        activity: MouseActivities
        target: DividerIndex | null
        absolutePosition: { x: number; y: number }
    }
    player: {
        duration: number
        currentTime: number
    }
}

export type Action =
    | { type: 'mouse/activity/tick' }
    | { type: 'mouse/activity/update'; payload: MouseActivities }
    | { type: 'mouse/target/update'; payload: DividerIndex | null }
    | { type: 'mouse/absolutePosition/update'; payload: { x: number; y: number } }
    | { type: 'lyric/update'; payload: string }
    | { type: 'page/state/update'; payload: PageOptions }
    | { type: 'page/width/update'; payload: number }
    | { type: 'page/zoom/update'; payload: number }
    | { type: 'page/root/left/update'; payload: number }
    | { type: 'slices/compute' }
    | { type: 'dividers/put'; payload: { leftOffset: number; time?: number } }
    | { type: 'dividers/remove'; payload: Divider['leftOffset'] }

export const Context = createContext<State>({} as unknown as State)
export const DispatchContext = createContext<Dispatch<Action>>(null as unknown as Dispatch<Action>)

export default function InternalStateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        page: {
            state: 'dividerEditor',
            width: 700,
            zoom: 1,
            root: { left: 0 }
        },
        dividers: [],
        slices: [],
        mouse: {
            activity: 'idle',
            target: null,
            absolutePosition: {
                x: 0,
                y: 0
            }
        },
        player: {
            duration: 50 * 1000,
            currentTime: 0
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
        case 'mouse/activity/tick':
            ActivityTickReducer(state)
            break
        case 'mouse/target/update':
            state.mouse.target = action.payload
            break
        case 'mouse/activity/update':
            state.mouse.activity = action.payload
            break
        case 'mouse/absolutePosition/update':
            state.mouse.absolutePosition = action.payload
            break
        case 'lyric/update':
            state.lyric = action.payload
            break
        case 'page/width/update':
            state.page.width = action.payload
            break
        case 'page/zoom/update':
            state.page.zoom = action.payload
            break
        case 'page/state/update':
            state.page.state = action.payload
            break
        case 'page/root/left/update':
            state.page.root.left = action.payload
            break
        case 'slices/compute':
        case 'dividers/put':
        case 'dividers/remove':
            dividersReducer(state, action)
            break
    }

    return state
}

export const useInternalState = () => useContext(Context)
export const useInternalSelector = <T,>(cb: (state: State) => T = (state) => state as T) =>
    cb(useInternalState())
export const useInternalDispatch = () => useContext(DispatchContext)
