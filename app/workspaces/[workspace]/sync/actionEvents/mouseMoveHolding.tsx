import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

/**
 * Events can only hold one callback per instance
 */
export default function useMouseMoveHolding(ref: RefObject<HTMLElement>) {
    type OnMove = (absoluteX: number, absoluteY: number) => void
    type OnMouseUp = () => void

    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const onMoveRef = useRef<OnMove | null>(null)
    const onMouseUpRef = useRef<OnMouseUp | null>(null)
    const [centerOffset, setCenterOffset] = useState(0)

    const mousemove = useCallback(
        (e: MouseEvent) => {
            if (!onMoveRef.current) return
            if (mouseDown == true) onMoveRef.current(e.clientX, e.clientY)
        },
        [mouseDown]
    )

    const mouseup = useCallback(() => {
        setMouseDown(false)
        if (!onMouseUpRef.current) return
        onMouseUpRef.current()
    }, [])

    const refMouseDown = useCallback(
        (e: MouseEvent) => {
            const left = ref.current?.getBoundingClientRect().left
            if (left) setCenterOffset(e.clientX - left)
            else setCenterOffset(0)

            setMouseDown(true)
        },
        [ref]
    )

    useEffect(() => {
        const element = ref.current
        if (!element) return

        element.addEventListener('mousedown', refMouseDown)

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
        return () => {
            element.removeEventListener('mousedown', refMouseDown)
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }
    }, [refMouseDown, mousemove, mouseup, ref])

    return {
        downOnTarget: mouseDown,
        targetOffset: {
            x: centerOffset,
        },
        setOnMove: (callback: OnMove) => {
            onMoveRef.current = callback
        },
        setOnMouseUp: (callback: OnMouseUp) => {
            onMouseUpRef.current = callback
        },
    }
}
