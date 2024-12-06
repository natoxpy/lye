import { Dispatch, ReactNode, createContext, useContext } from 'react'
import * as TimelineManager from './boardManager'
import { useImmerReducer } from 'use-immer'
import { Milliseconds, Pixels } from '@/utils/units'

export type Action<N, T> = { type: N; payload: T }

export type State = TimelineManager.State
export type Actions = TimelineManager.Actions

const initialState: State = {
    boardManager: {
        inbetweenTicks: 10,
        tickLength: 10_000 as Milliseconds,
        area: 0 as Pixels,
        width: {
            ms: 0 as Milliseconds,
            px: 0 as Pixels,
        },
        offset: {
            ms: 0 as Milliseconds,
            px: 0 as Pixels,
        },
        timelines: [],
    },
}

export const StateContext = createContext<State>({} as State)
export const DispatchContext = createContext<Dispatch<Actions>>(
    {} as Dispatch<Actions>
)

export default function State({ children }: { children: ReactNode }) {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    return (
        <>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    {children}
                </DispatchContext.Provider>
            </StateContext.Provider>
        </>
    )
}

function reducer(draft: State, action: Actions) {
    TimelineManager.reducer(draft, action)
}

export const useState = () => useContext(StateContext)
export const useDispatch = () => useContext(DispatchContext)
