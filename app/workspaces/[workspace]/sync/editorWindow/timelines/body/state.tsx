import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from 'react'

// all values are milliseconds
type State = {
    timeOffset: number
    canvasWidthPx: number
    timeWidth: number
    setTimeOffset: Dispatch<SetStateAction<number>>
    setTimeWidth: Dispatch<SetStateAction<number>>
    setCanvasWidthPx: Dispatch<SetStateAction<number>>
}
const Context = createContext<State>({} as State)

export const useLocalState = () => useContext(Context)

export default function Provider({ children }: { children: React.ReactNode }) {
    const [timeOffset, setTimeOffset] = useState(0)
    const [timeWidth, setTimeWidth] = useState(0)
    const [canvasWidthPx, setCanvasWidthPx] = useState(0)

    return (
        <Context.Provider
            value={{
                timeOffset,
                setTimeOffset,
                timeWidth,
                setTimeWidth,
                canvasWidthPx,
                setCanvasWidthPx,
            }}
        >
            {children}
        </Context.Provider>
    )
}
