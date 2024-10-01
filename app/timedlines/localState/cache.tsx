import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { SessionReference } from '@/app/cachedb/sessions'

export type State = { session: SessionReference | null; activeLyrics: Array<[number, string]> }
export type Action =
    | { type: 'session/update'; payload: SessionReference | null }
    | {
          type: 'activeLyrics/update'
          payload: Array<[number, string]>
      }

const CacheContext = createContext<State>({} as any)
const DispatchContext = createContext<Dispatch<Action>>(null as any)

export function LocalCacheProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {} as any)

    return (
        <CacheContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </CacheContext.Provider>
    )
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'session/update':
            return {
                ...state,
                session: action.payload
            }
        case 'activeLyrics/update':
            return {
                ...state,
                activeLyrics: action.payload
            }
    }

    return state
}

export const useCacheState = () => useContext(CacheContext)
export const useCacheDispatch = () => useContext(DispatchContext)
