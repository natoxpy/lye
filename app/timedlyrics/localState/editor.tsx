import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { SessionReference } from '@/app/cachedb/sessions'
import { UHash } from '@/app/cachedb'

export type State = {
    activeLine: UHash | null
}
export type Action =
    | { type: 'session/update'; payload: SessionReference | null }
    | {
          type: 'activeLyrics/update'
          payload: Array<[number, string]>
      }

const CacheContext = createContext<State>({} as unknown as State)
const DispatchContext = createContext<Dispatch<Action>>(null as unknown as Dispatch<Action>)

export function LocalEditorProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        activeLine: null
    } satisfies State)

    return (
        <CacheContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </CacheContext.Provider>
    )
}

function reducer(prevState: State, action: Action): State {
    const state = structuredClone(prevState)

    switch (action.type) {
        case 'session/update':
            break
        case 'activeLyrics/update':
            break
    }

    return state
}

export const useEditorState = () => useContext(CacheContext)
export const useEditorDispatch = () => useContext(DispatchContext)
