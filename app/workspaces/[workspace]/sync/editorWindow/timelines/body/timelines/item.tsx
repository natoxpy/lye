import { useRef } from 'react'
import { useLocalState } from '../state'

export default function Item({
    number,
    start,
    duration,
}: {
    number: number
    start: number
    duration: number
}) {
    const { timeWidth, canvasWidthPx, setTargetItem, setTargetOffsetPx } =
        useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const rootRef = useRef<HTMLDivElement>(null)

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            ref={rootRef}
            style={{ left, width }}
            className="flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-unaccent-accent-1"
            onMouseDown={(e) => {
                if (!rootRef.current) return
                setTargetItem(number)
                const left = rootRef.current.getBoundingClientRect().left
                setTargetOffsetPx(e.clientX - left)
            }}
        >
            <span className="text-[16px] text-txt-2 select-none">{number}</span>
        </div>
    )
}
