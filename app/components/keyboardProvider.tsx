import React, { createContext, useContext, useEffect, useState } from 'react'

type State = { shift: boolean }

const KeyboardContext = createContext<State>({ shift: true })

export function useKeys() {
    return useContext(KeyboardContext)
}

export default function Provider({ children }: { children: React.ReactNode }) {
    const [shift, setShift] = useState(false)

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key == 'Shift') setShift(true)
        }

        const keyup = (e: KeyboardEvent) => {
            if (e.key == 'Shift') setShift(false)
        }

        document.addEventListener('keydown', keydown)
        document.addEventListener('keyup', keyup)

        return () => {
            document.removeEventListener('keydown', keydown)
            document.removeEventListener('keyup', keyup)
        }
    })

    return (
        <KeyboardContext.Provider
            value={{
                shift,
            }}
        >
            {children}
        </KeyboardContext.Provider>
    )
}
