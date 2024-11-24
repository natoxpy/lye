import { RefObject, useCallback, useEffect, useRef } from 'react'

export function fitCanvasOnParent(
    parent: HTMLDivElement,
    canvas: HTMLCanvasElement
) {
    const parentBoundaryBox = parent.getBoundingClientRect()
    const width = parentBoundaryBox.width
    const staticHeight = 28
    const ctx = canvas.getContext('2d')

    const dpr = window.devicePixelRatio ?? 1

    canvas.width = width * dpr
    canvas.height = staticHeight * dpr

    canvas.style.height = staticHeight + 'px'

    ctx?.scale(dpr, dpr)
}

export function useCanvasResize(
    parentref: RefObject<HTMLDivElement>,
    canvasref: RefObject<HTMLCanvasElement>
) {
    const events = useRef<Array<() => void>>([])

    const dispatch = useCallback(() => {
        events.current.map((event) => event())
    }, [events])

    useEffect(() => {
        const canvas = canvasref.current
        const parent = parentref.current
        if (canvas == null || parent == null) return

        const resize = () => {
            fitCanvasOnParent(parent, canvas)
            dispatch()
        }

        resize()

        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [parentref, canvasref, dispatch])

    return (event: () => void) => {
        const set = new Set(events.current)
        if (set.has(event)) return

        events.current.push(event)
    }
}
