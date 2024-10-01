import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { SessionReference } from '@/app/cachedb/sessions'

export type State = { session: SessionReference | null; activeLyrics: Array<[number, string]> }
export type Action = { type: 'session/update'; payload: SessionReference | null }

const EditorContext = createContext<State>({} as any)
const DispatchContext = createContext<Dispatch<Action>>(null as any)

export function LocalEditorProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {} as any)

    return (
        <EditorContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </EditorContext.Provider>
    )
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'session/update':
            return {
                ...state,
                session: action.payload
            }
    }
}

export const useEditorState = () => useContext(EditorContext)
export const useEditorDispatch = () => useContext(DispatchContext)
