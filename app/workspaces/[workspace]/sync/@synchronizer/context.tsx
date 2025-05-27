import { ReactNode, createContext, RefObject, useContext } from 'react'

const LayoutContext = createContext<{
    container: RefObject<HTMLDivElement> | null
}>({
    container: null,
})

export const useLayoutContext = () => useContext(LayoutContext)

export function LayoutContextProvider({
    container,
    children,
}: {
    container: RefObject<HTMLDivElement>
    children: ReactNode
}) {
    return (
        <LayoutContext.Provider value={{ container }}>
            {children}
        </LayoutContext.Provider>
    )
}
