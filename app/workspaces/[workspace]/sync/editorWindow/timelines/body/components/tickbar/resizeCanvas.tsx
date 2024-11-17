import { RefObject, useCallback, useEffect, useRef } from 'react'

export function fitCanvasOnParent(
    parent: HTMLDivElement,
    canvas: HTMLCanvasElement
) {
    const parentBoundaryBox = parent.getBoundingClientRect()
    const width = parentBoundaryBox.width
    const height = parentBoundaryBox.height

    canvas.width = width
    canvas.height = height
}

export function useCanvasResize(
    parentref: RefObject<HTMLDivElement>,
    canvasref: RefObject<HTMLCanvasElement>
) {
    const events = useRef<Array<() => void>>([])

    const dispatch = useCallback(
        () => events.current.map((event) => event()),
        [events]
    )

    useEffect(() => {
        const canvas = canvasref.current
        const parent = parentref.current
        if (canvas == null || parent == null) return

        const resize = () => {
            dispatch()
            fitCanvasOnParent(parent, canvas)
        }

        resize()

        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [parentref, canvasref, dispatch])

    return (event: () => void) => {
        const set = new Set(events.current)
        if (set.has(event)) events.current.push(event)
    }
}
