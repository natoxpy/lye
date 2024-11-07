import { useRef } from 'react'
import { useLocalState } from '../state'
import { useAppSelector } from '@/store/hooks'

export function TrueMoveTemplate({ timeline }: { timeline: string }) {
    const {
        timeWidth,
        canvasWidthPx,
        targetItem,
        cursorLocation,
        cursorLevelTarget,
    } = useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const lines = useAppSelector((state) => state.syncLines.lines)
    const rootRef = useRef<HTMLDivElement>(null)

    const line = lines.find((item) => item.lineNumber == targetItem)
    if (line == undefined || timeline !== cursorLevelTarget) return <></>

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
            className="pointer-events-none z-20 flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-red-400 border-2 border-red-700 opacity-15"
        ></div>
    )
}

export function MoveTemplate({ timeline }: { timeline: string }) {
    const {
        timeWidth,
        canvasWidthPx,
        locationTarget,
        targetItem,
        levelTarget,
    } = useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const lines = useAppSelector((state) => state.syncLines.lines)
    const rootRef = useRef<HTMLDivElement>(null)

    const line = lines.find((item) => item.lineNumber == targetItem)
    if (line == undefined || levelTarget !== timeline) return <></>

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
            className="pointer-events-none z-20 flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-bg-4 border-2 border-accent-1 opacity-50"
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
        resizeType,
        setTargetItem,
        setTargetOffsetPx,
        setResizeType,
    } = useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)
    const rootRef = useRef<HTMLDivElement>(null)

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            ref={rootRef}
            onDragStart={(e) => e.preventDefault()}
            style={{
                left,
                width,
                background: 'var(--color-unaccent-accent-1)',
                opacity:
                    targetItem == number && resizeType === null ? '0.5' : '1',
                border:
                    targetItem == number && resizeType == null
                        ? '2px solid var(--color-accent-1)'
                        : '',
            }}
            className="flex cursor-pointer overflow-hidden items-center justify-center absolute rounded-[6px] h-[32px]"
            onMouseDown={(e) => {
                if (!rootRef.current) return
                setTargetItem(number)
                const left = rootRef.current.getBoundingClientRect().left
                setTargetOffsetPx(e.clientX - left)
            }}
        >
            <div
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setResizeType('left')
                    setTargetItem(number)
                }}
                style={{
                    background:
                        targetItem == number && resizeType == 'left'
                            ? 'var(--color-accent-1)'
                            : '',
                }}
                className="absolute cursor-ew-resize left-0 w-[8px] h-full hover:bg-accent-1 transition-all opacity-25"
            ></div>
            <div className="w-[calc(100%-8px)] bg-unaccent-accent-1 z-10 pointer-events-none rounded-md flex justify-center">
                <span className="pointer-events-none text-[16px] text-txt-2 select-none">
                    {number}
                </span>
            </div>
            <div
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setResizeType('right')
                    setTargetItem(number)
                }}
                style={{
                    background:
                        targetItem == number && resizeType == 'right'
                            ? 'var(--color-accent-1)'
                            : '',
                }}
                className="absolute cursor-ew-resize left-[calc(100%-8px)] w-[8px] h-full hover:bg-accent-1 transition-all opacity-25"
            ></div>
        </div>
    )
}
