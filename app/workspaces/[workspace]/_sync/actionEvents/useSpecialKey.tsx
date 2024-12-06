import { useEffect, useState } from 'react'

export function useSpecialKey() {
    const [shift, setShift] = useState(false)
    const [ctrl, setCtrl] = useState(false)

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key == 'Shift') setShift(true)
            if (e.key == 'Control') setCtrl(true)
        }

        const keyup = (e: KeyboardEvent) => {
            if (e.key == 'Shift') setShift(false)
            if (e.key == 'Control') setCtrl(false)
        }

        document.addEventListener('keydown', keydown)
        document.addEventListener('keyup', keyup)

        return () => {
            document.removeEventListener('keydown', keydown)
            document.removeEventListener('keyup', keyup)
        }
    })

    return { shift, ctrl }
}
