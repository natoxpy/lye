import { useCallback, useEffect, useRef } from 'react'

export function useResizeEvent(): [(e: () => void) => void, () => void] {
    const events = useRef<Array<() => void>>([])

    const dispatch = useCallback(
        () => events.current.map((event) => event()),
        [events]
    )

    useEffect(() => {
        const resize = () => {
            dispatch()
        }

        resize()

        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [dispatch])

    return [
        (event: () => void) => {
            const set = new Set(events.current)
            if (set.has(event)) return

            events.current.push(event)
        },
        dispatch,
    ]
}
