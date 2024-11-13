import { ReactNode, createContext, useState } from 'react'
import { Pixels } from '@/app/utils/units'

type State = {
    canvasWidth: Pixels
    scrollWidth: Pixels
}

const Context = createContext({} as State)

export default function Provider({ children }: { children: ReactNode }) {
    const [canvasWidth, setCanvasWidth] = useState(0 as Pixels)
    const [scrollWidth, setScrollWidth] = useState(0 as Pixels)

    return (
        <Context.Provider
            value={{
                canvasWidth,
                scrollWidth,
            }}
        >
            {children}
        </Context.Provider>
    )
}
