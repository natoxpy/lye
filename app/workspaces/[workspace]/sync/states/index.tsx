import { ReactNode, createContext, useReducer } from 'react'

const initialState = {
    code: 1,
}

const StateContext = createContext({})
const DispatchContext = createContext({})

export default function State({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

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

function reducer(state: typeof initialState, action: any) {
    return state
}
