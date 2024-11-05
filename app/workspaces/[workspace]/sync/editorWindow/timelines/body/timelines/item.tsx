import { useRef } from 'react'
import { useLocalState } from '../state'
import { useAppSelector } from '@/store/hooks'

export function TrueMoveTemplate({}: { timeline: string }) {
    const { timeWidth, canvasWidthPx, targetItem, cursorLocation } =
        useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const lines = useAppSelector((state) => state.syncLines.lines)
    const rootRef = useRef<HTMLDivElement>(null)

    const line = lines.find((item) => item.lineNumber == targetItem)
    if (line == undefined) return <></>

    const start = cursorLocation
    const duration = line.durationMs

    if (start == null) return <></>

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            ref={rootRef}
            style={{
                left,
                width,
            }}
            className="flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-red-400 border-2 border-red-700 opacity-15"
        ></div>
    )
}

export function MoveTemplate({}: { timeline: string }) {
    const { timeWidth, canvasWidthPx, locationTarget, targetItem } =
        useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const lines = useAppSelector((state) => state.syncLines.lines)
    const rootRef = useRef<HTMLDivElement>(null)

    const line = lines.find((item) => item.lineNumber == targetItem)
    if (line == undefined) return <></>

    const start = locationTarget
    const duration = line.durationMs

    if (start == null) return <></>

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            ref={rootRef}
            style={{
                left,
                width,
            }}
            className="flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-bg-4 border-2 border-accent-1 opacity-50"
        ></div>
    )
}

export default function Item({
    number,
    start,
    duration,
}: {
    number: number
    start: number
    duration: number
}) {
    const {
        timeWidth,
        canvasWidthPx,
        targetItem,
        setTargetItem,
        setTargetOffsetPx,
    } = useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const rootRef = useRef<HTMLDivElement>(null)

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            ref={rootRef}
            style={{
                left,
                width,
                background: 'var(--color-unaccent-accent-1)',
                opacity: targetItem == number ? '0.5' : '1',
                border:
                    targetItem == number
                        ? '2px solid var(--color-accent-1)'
                        : '',
            }}
            className="flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-"
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
