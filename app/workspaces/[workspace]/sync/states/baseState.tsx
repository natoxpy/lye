import { ReactNode, createContext } from 'react'
import { Pixels } from '@/app/utils/units'

type State = {
    canvasWidth: Pixels
    scrollWidth: Pixels
}

const Context = createContext({} as State)

export default function Provider({ children }: { children: ReactNode }) {
    return <Context.Provider value={}>{children}</Context.Provider>
}
