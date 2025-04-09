import { createContext, Dispatch, useContext, useReducer } from 'react'
import { Milliseconds, Seconds } from '../../../utils/units'

export type State = {
    targetCurrentTime: Seconds | null
    currentTime: Milliseconds
    duration: Milliseconds
    playbackRate: number
    paused: boolean
    volume: number
    src: string | null
}

type Actions =
    | { type: 'set-currentTime'; payload: Milliseconds }
    | { type: 'set-duration'; payload: Milliseconds }
    | { type: 'set-playbackRate'; payload: number }
    | { type: 'set-paused'; payload: boolean }
    | { type: 'set-volume'; payload: number }
    | { type: 'set-src'; payload: string }
    | { type: 'sync-currentTime'; payload: Seconds | null }

const defaultState: State = {
    targetCurrentTime: null,
    currentTime: 0 as Milliseconds,
    duration: 0 as Milliseconds,
    playbackRate: 1,
    paused: true,
    volume: 1,
    src: null,
}

const StateContext = createContext<State>(defaultState)
const DispatchContext = createContext<Dispatch<Actions>>(
    {} as Dispatch<Actions>
)

export default function StateProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [state, dispatch] = useReducer(reducer, defaultState)

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function reducer(prevstate: State, action: Actions) {
    const state = structuredClone(prevstate)

    switch (action.type) {
        case 'set-currentTime':
            state.currentTime = action.payload
            break
        case 'set-duration':
            state.duration = action.payload
            break
        case 'set-paused':
            state.paused = action.payload
            break
        case 'set-playbackRate':
            state.playbackRate = action.payload
            break
        case 'set-volume':
            state.volume = action.payload
            break
        case 'set-src':
            state.src = action.payload
            break
        case 'sync-currentTime':
            state.targetCurrentTime = action.payload
    }

    return state
}

export const usePlayerState = () => useContext(StateContext)
export const usePlayerDispatch = () => useContext(DispatchContext)
