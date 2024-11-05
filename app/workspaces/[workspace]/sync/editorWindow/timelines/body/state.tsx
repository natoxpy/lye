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
    locationTarget: number | null
    cursorLocation: number | null // for when location target is limited
    levelTarget: 'primary' | 'secondary' | null
    setTimeOffset: Dispatch<SetStateAction<number>>
    setTimeWidth: Dispatch<SetStateAction<number>>
    setCanvasWidthPx: Dispatch<SetStateAction<number>>
    setTargetItem: Dispatch<SetStateAction<number | null>>
    setTargetOffsetPx: Dispatch<SetStateAction<number | null>>
    setVisibleMarks: Dispatch<SetStateAction<number[]>>
    setLocationTarget: Dispatch<SetStateAction<number | null>>
    setCursorLocation: Dispatch<SetStateAction<number | null>>
    setLevelTarget: Dispatch<SetStateAction<'primary' | 'secondary' | null>>
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
    const [locationTarget, setLocationTarget] = useState<number | null>(null)
    const [cursorLocation, setCursorLocation] = useState<number | null>(null)
    const [levelTarget, setLevelTarget] = useState<
        'primary' | 'secondary' | null
    >(null)

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
                locationTarget,
                setLocationTarget,
                cursorLocation,
                setCursorLocation,
                levelTarget,
                setLevelTarget,
            }}
        >
            {children}
        </Context.Provider>
    )
}
