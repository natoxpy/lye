import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

class Position {
    static from(xPx: number, yPx: number) {
        console.log(xPx, yPx)
        return new Position()
    }
}

type Data = {
    rawMouse: Position
}

const mousePositionState = createContext<Data>({} as Data)

export default function StateProvider({ children }: { children: ReactNode }) {
    const [rawMousePosition, setRawMousePosition] = useState<Position>(
        Position.from(0, 0)
    )

    useEffect(() => {
        const mouseMove = (e: MouseEvent) =>
            setRawMousePosition({ x: e.clientX, y: e.clientY })
        document.addEventListener('mousemove', mouseMove)
        return () => document.removeEventListener('mousemove', mouseMove)
    })

    return (
        <mousePositionState.Provider value={{ rawMouse: rawMousePosition }}>
            {children}
        </mousePositionState.Provider>
    )
}

export const useMousePositionState = () => useContext(mousePositionState)
