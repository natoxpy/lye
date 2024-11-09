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
    scrollWidthPx: number
    timeWidth: number
    targetItem: number | null
    targetOffsetPx: number | null
    visibleMarks: number[]
    locationTarget: number | null
    cursorLocation: number | null // for when location target is limited
    levelTarget: 'primary' | 'secondary' | null
    cursorLevelTarget: 'primary' | 'secondary' | null
    resizeType: 'left' | 'right' | null
    removeTarget: boolean
    setTimeOffset: Dispatch<SetStateAction<number>>
    setTimeWidth: Dispatch<SetStateAction<number>>
    setCanvasWidthPx: Dispatch<SetStateAction<number>>
    setScrollWidthPx: Dispatch<SetStateAction<number>>
    setTargetItem: Dispatch<SetStateAction<number | null>>
    setTargetOffsetPx: Dispatch<SetStateAction<number | null>>
    setVisibleMarks: Dispatch<SetStateAction<number[]>>
    setLocationTarget: Dispatch<SetStateAction<number | null>>
    setCursorLocation: Dispatch<SetStateAction<number | null>>
    setLevelTarget: Dispatch<SetStateAction<'primary' | 'secondary' | null>>
    setCursorLevelTarget: Dispatch<
        SetStateAction<'primary' | 'secondary' | null>
    >
    setResizeType: Dispatch<SetStateAction<'left' | 'right' | null>>
    setRemoveTarget: Dispatch<SetStateAction<boolean>>
}
const Context = createContext<State>({} as State)

export const useLocalState = () => useContext(Context)

export default function Provider({ children }: { children: React.ReactNode }) {
    const [timeOffset, setTimeOffset] = useState(0)
    const [timeWidth, setTimeWidth] = useState(0)
    const [canvasWidthPx, setCanvasWidthPx] = useState(0)
    const [scrollWidthPx, setScrollWidthPx] = useState(0)
    const [targetItem, setTargetItem] = useState<number | null>(null)
    const [targetOffsetPx, setTargetOffsetPx] = useState<number | null>(0)
    const [visibleMarks, setVisibleMarks] = useState<number[]>([])
    const [locationTarget, setLocationTarget] = useState<number | null>(null)
    const [cursorLocation, setCursorLocation] = useState<number | null>(null)
    const [resizeType, setResizeType] = useState<'left' | 'right' | null>(null)
    const [levelTarget, setLevelTarget] = useState<
        'primary' | 'secondary' | null
    >(null)
    const [cursorLevelTarget, setCursorLevelTarget] = useState<
        'primary' | 'secondary' | null
    >(null)
    const [removeTarget, setRemoveTarget] = useState<boolean>(false)

    return (
        <Context.Provider
            value={{
                timeOffset,
                setTimeOffset,
                timeWidth,
                setTimeWidth,
                canvasWidthPx,
                setCanvasWidthPx,
                scrollWidthPx,
                setScrollWidthPx,
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
                resizeType,
                setResizeType,
                levelTarget,
                setLevelTarget,
                cursorLevelTarget,
                setCursorLevelTarget,
                removeTarget,
                setRemoveTarget,
            }}
        >
            {children}
        </Context.Provider>
    )
}
