import { createContext, Dispatch, useContext, useReducer } from 'react'

export const HEADER_INITIAL = '\u200B'

export type StateLines = Array<{
    content: string
    lineNumber: number
    type: 'content' | 'header'
    id: string
}>

export type State = {
    workspace: {
        active?: string
        // variants: Array<string>
    }
    variants: Array<{
        id: string
        name: string
        editing?: 'languages' | 'name'
        languages: { code: string; nativeName: string }[]
    }>
    lines: Record<string, StateLines>
}
export type Action =
    | {
          type: 'set-lines'
          payload: { lines: StateLines; variantId: string }
      }
    | {
          type: 'set-edit-variant'
          payload: { id: string; editing?: 'languages' | 'name' }
      }
    | { type: 'set-variant-name'; payload: { id: string; name: string } }
    | {
          type: 'set-languages'
          payload: {
              id: string
              languages: Array<{ code: string; nativeName: string }>
          }
      }
    | { type: 'new-variant' }
    | { type: 'set-active-workspace'; payload: { id: undefined | string } }
    | { type: 'delete-variant'; payload: { id: string } }

const DefaultState: State = {
    workspace: {},
    variants: [
        {
            id: 'original',
            name: 'Original',
            languages: [{ code: 'en', nativeName: 'English' }],
        },
    ],
    lines: {
        original: [
            {
                content: '',
                type: 'content',
                id: 'i1',
                lineNumber: 1,
            },
        ],
    },
}

const StateContext = createContext<State>(DefaultState)
const DispatchContext = createContext<Dispatch<Action>>({} as Dispatch<Action>)

export default function StateProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [state, dispatch] = useReducer(reducer, DefaultState)

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function reducer(prevstate: State, action: Action) {
    const state = structuredClone(prevstate)

    switch (action.type) {
        case 'set-lines':
            state.lines[action.payload.variantId] = action.payload.lines
            break
        case 'set-edit-variant': {
            state.variants = state.variants.map((variant) => ({
                ...variant,
                editing: undefined,
            }))

            const variant = state.variants.find(
                (variant) => variant.id === action.payload.id
            )
            if (!variant) break

            variant.editing = action.payload.editing
            break
        }

        case 'set-languages': {
            const variant = state.variants.find(
                (variant) => variant.id === action.payload.id
            )
            if (!variant) break
            variant.languages = action.payload.languages

            break
        }

        case 'set-variant-name': {
            const variant = state.variants.find(
                (variant) => variant.id === action.payload.id
            )
            if (!variant) break
            variant.name = action.payload.name
            break
        }

        case 'new-variant':
            const generateId = () => Math.round(Math.random() * 1_000_000)
            const id = 'e' + generateId()

            state.variants = [
                ...state.variants,
                {
                    name: '',
                    id,
                    languages: [],
                    editing: 'name',
                },
            ]

            state.lines[id] = [
                {
                    content: '',
                    id: 'i' + generateId(),
                    lineNumber: 1,
                    type: 'content',
                },
            ]
            break
        case 'delete-variant': {
            state.variants = state.variants.filter(
                (variant) => variant.id !== action.payload.id
            )
            break
        }
        case 'set-active-workspace': {
            state.workspace.active = action.payload.id
            break
        }
    }

    return state
}

export function useState() {
    return useContext(StateContext)
}

export function useDispatch() {
    return useContext(DispatchContext)
}
