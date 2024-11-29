import { createContext, Dispatch, useReducer } from 'react'

export type State = 'dark'
export type Action = { type: 'set'; payload: State }

const StateContext = createContext<State>('dark')
const DispatchContext = createContext<Dispatch<Action>>({} as Dispatch<Action>)

export default function Provider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, 'dark')

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function reducer(_: State, action: Action) {
    return action.payload
}
