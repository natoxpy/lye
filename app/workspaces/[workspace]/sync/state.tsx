import { createContext, Dispatch, useContext, useReducer } from 'react'

export type State = {
    l: []
}
export type Actions = {
    type: ''
}

const defaultState: State = { l: [] }
const StateContext = createContext(defaultState)
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
    }

    return state
}

export const useSyncState = () => useContext(StateContext)
export const useSyncDispatch = () => useContext(StateContext)
