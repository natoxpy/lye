import { createContext, useContext, useReducer, type Dispatch } from 'react'

export type State = { detailTime: number; zoomSize: number; focusViewRoot: HTMLDivElement | null }
export type Action =
    | { type: 'detailTime/update'; payload: number }
    | { type: 'zoomSize/update'; payload: number }

const EditorContext = createContext<State>({} as unknown as State)
const DispatchContext = createContext<Dispatch<Action>>(null as unknown as Dispatch<Action>)

export function LocalEditorProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        detailTime: 1000,
        zoomSize: 1,
        focusViewRoot: null
    } satisfies State)

    return (
        <EditorContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </EditorContext.Provider>
    )
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'detailTime/update':
            return {
                ...state,
                detailTime: action.payload
            }
        case 'zoomSize/update':
            return {
                ...state,
                zoomSize: action.payload
            }
    }

    return state
}

export const useEditorState = () => useContext(EditorContext)
export const useEditorDispatch = () => useContext(DispatchContext)
