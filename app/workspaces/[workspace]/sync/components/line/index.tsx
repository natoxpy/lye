import { usePlayerState } from '@/app/player/state'
import { formatMS } from '@/app/utils/time'
import { useEffect, useRef, useState } from 'react'
import { useLocalTimelineState } from '../../states/timeline'

function DoubleSidedIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="46"
            viewBox="0 0 10 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M2 1H5H8V3.2L5 5.4V40.6L8 42.8V45H5H2V42.8L5 40.6V5.4L2 3.2V1Z" />
            <path
                d="M5 5.4L2 3.2V1H5H8V3.2L5 5.4ZM5 5.4V40.6M5 40.6L2 42.8V45H5H8V42.8L5 40.6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default function Component({
    lineId,
    lineNumber,
    text,
    inTimeLine,
    timeframe,
}: {
    lineId: string
    text: string
    lineNumber: number
    inTimeLine: boolean
    timeframe?: [number, number]
}) {
    const rootRef = useRef<HTMLDivElement>(null)
    const [left, setLeft] = useState(-10)
    const { currentTime, duration } = usePlayerState()
    const { setOutsideLineTarget, setOutsideLineTargetId } =
        useLocalTimelineState()

    useEffect(() => {
        const root = rootRef.current
        if (!root || timeframe == undefined) return

        const start = timeframe[0]
        const width = root.getBoundingClientRect().width
        const lineDuration = timeframe[1] - timeframe[0]

        const offset = (start / lineDuration) * width
        const value = (currentTime / lineDuration) * width

        setLeft(value - offset - 4)
    }, [currentTime, duration, timeframe])

    const bg = inTimeLine ? 'var(--color-bg-5)' : 'var(--color-bg-2)'

    return (
        <div
            style={{
                color: inTimeLine ? 'var(--color-txt-2)' : 'var(--color-txt-3)',
                cursor: !inTimeLine ? 'pointer' : '',
            }}
            onMouseDown={() => {
                if (inTimeLine) return

                setOutsideLineTarget(lineNumber)
                setOutsideLineTargetId(lineId)
            }}
            className="flex bg-bg-4 text-[1rem] select-none gap-[3px] min-w-[1000px] h-[46px] rounded-[4px] overflow-hidden"
        >
            <div
                style={{
                    background: bg,
                }}
                className="flex items-center justify-center min-w-[56px] h-full"
            >
                <span>{lineNumber}</span>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="flex items-center justify-center min-w-[112px] h-full"
            >
                <span>{formatMS(timeframe?.[0])}</span>
            </div>
            <div
                ref={rootRef}
                style={{
                    background: bg,
                }}
                className="relative overflow-hidden px-[24px] flex w-full h-full items-center"
            >
                <DoubleSidedIcon
                    style={{
                        left: left + 'px',
                    }}
                    className="absolute fill-accent-1 stroke-accent-1"
                />

                <span>{text}</span>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="flex items-center justify-center  min-w-[112px] h-full"
            >
                <span>{formatMS(timeframe?.[1])}</span>
            </div>
        </div>
    )
}
