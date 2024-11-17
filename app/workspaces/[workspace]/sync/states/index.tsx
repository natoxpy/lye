import { Dispatch, ReactNode, createContext, useContext } from 'react'
import * as TimelineManager from './boardManager'
import { useImmerReducer } from 'use-immer'

export type Action<N, T> = { type: N; payload: T }

export type State = TimelineManager.State
export type Actions = TimelineManager.Actions

const initialState: State = {
    boardManager: {
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
