import { usePlayerState } from '@/app/player/state'
// import { formatMS } from '@/app/utils/time'
import { useEffect, useRef, useState } from 'react'
// import { useLocalTimelineState } from '../../states/timeline'
import { Layout } from './layout'
import { Milliseconds } from '@/app/utils/units'

export default function Component({
    lineNumber,
    text,
    inTimeLine,
    start,
    end,
}: {
    lineId: string
    text: string
    lineNumber: number
    inTimeLine: boolean
    start?: Milliseconds
    end?: Milliseconds
}) {
    const rootRef = useRef<HTMLDivElement>(null)
    const [left, setLeft] = useState(-10)
    const { currentTime, duration } = usePlayerState()

    useEffect(() => {
        const root = rootRef.current
        if (!root || !start || !end) return

        const width = root.getBoundingClientRect().width
        const lineDuration = end - start

        const offset = (start / lineDuration) * width
        const value = (currentTime / lineDuration) * width

        setLeft(value - offset - 4)
    }, [currentTime, duration, end, start])

    return (
        <Layout
            onClick={() => {
                console.log('123')
            }}
            line={lineNumber}
            content={text}
            left={left}
            start={start}
            end={end}
            inTimeLine={inTimeLine}
        />
    )

    // return (
    //     <div
    //         style={{
    //             color: inTimeLine ? 'var(--color-txt-2)' : 'var(--color-txt-3)',
    //             cursor: !inTimeLine ? 'pointer' : '',
    //         }}
    //         onMouseDown={() => {
    //             if (inTimeLine) return

    //             setOutsideLineTarget(lineNumber)
    //             setOutsideLineTargetId(lineId)
    //         }}
    //         className="flex bg-bg-4 text-[1rem] select-none gap-[3px] min-w-[1000px] h-[46px] rounded-[4px] overflow-hidden"
    //     >
    //         <div
    //             style={{
    //                 background: bg,
    //             }}
    //             className="flex items-center justify-center min-w-[56px] h-full"
    //         >
    //             <span>{lineNumber}</span>
    //         </div>
    //         <div
    //             style={{
    //                 background: bg,
    //             }}
    //             className="flex items-center justify-center min-w-[112px] h-full"
    //         >
    //             <span>{formatMS(timeframe?.[0])}</span>
    //         </div>
    //         <div
    //             ref={rootRef}
    //             style={{
    //                 background: bg,
    //             }}
    //             className="relative overflow-hidden px-[24px] flex w-full h-full items-center"
    //         >
    //             <DoubleSidedIcon
    //                 style={{
    //                     left: left + 'px',
    //                 }}
    //                 className="absolute fill-accent-1 stroke-accent-1"
    //             />

    //             <span>{text}</span>
    //         </div>
    //         <div
    //             style={{
    //                 background: bg,
    //             }}
    //             className="flex items-center justify-center  min-w-[112px] h-full"
    //         >
    //             <span>{formatMS(timeframe?.[1])}</span>
    //         </div>
    //     </div>
    // )
}
