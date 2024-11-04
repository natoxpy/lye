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
    targetItem: number | null
    targetOffsetPx: number | null
    visibleMarks: number[]
    setTimeOffset: Dispatch<SetStateAction<number>>
    setTimeWidth: Dispatch<SetStateAction<number>>
    setCanvasWidthPx: Dispatch<SetStateAction<number>>
    setTargetItem: Dispatch<SetStateAction<number | null>>
    setTargetOffsetPx: Dispatch<SetStateAction<number | null>>
    setVisibleMarks: Dispatch<SetStateAction<number[]>>
}
const Context = createContext<State>({} as State)

export const useLocalState = () => useContext(Context)

export default function Provider({ children }: { children: React.ReactNode }) {
    const [timeOffset, setTimeOffset] = useState(0)
    const [timeWidth, setTimeWidth] = useState(0)
    const [canvasWidthPx, setCanvasWidthPx] = useState(0)
    const [targetItem, setTargetItem] = useState<number | null>(null)
    const [targetOffsetPx, setTargetOffsetPx] = useState<number | null>(null)
    const [visibleMarks, setVisibleMarks] = useState<number[]>([])

    return (
        <Context.Provider
            value={{
                timeOffset,
                setTimeOffset,
                timeWidth,
                setTimeWidth,
                canvasWidthPx,
                setCanvasWidthPx,
                targetItem,
                setTargetItem,
                targetOffsetPx,
                setTargetOffsetPx,
                visibleMarks,
                setVisibleMarks,
            }}
        >
            {children}
        </Context.Provider>
    )
}
