'use client'
import TimelineComponent from './timeline/component'
import DragToTimelineComponent from './timeline/DragToTimelineComponent'
import StateLoader from './StateLoader'
import * as TimedlinesActions from '@/lib/timedlines'
import { useCacheState, LocalStoreProvider } from './localState/'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { useEffect } from 'react'
import { cyrb53 } from '@/app/cachedb/index'
import { TimedLinesReferenceLine } from '../cachedb/timedlines'

export function formattedMS(milliseconds?: number) {
    if (milliseconds == undefined) return '--:--.---'

    const ms = Math.round(milliseconds) % 1000
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor(milliseconds / 1000 / 60)

    const fms = ms < 10 ? '.00' + ms : ms < 100 ? '.0' + ms : '.' + ms

    return `${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
    }${fms}`
}

function LyricsView() {
    const activeLyric = useAppSelector((state) => state.lyrics.active)
    const timedlines = useAppSelector((state) => state.timedlines)
    const dispatch = useAppDispatch()
    const { session } = useCacheState()

    useEffect(() => {
        if (!session) return
        session.timedlines.primary.lines = timedlines.primary.map(
            (data) => new TimedLinesReferenceLine(data)
        )

        session.timedlines.secondary.lines = timedlines.secondary.map(
            (data) => new TimedLinesReferenceLine(data)
        )

        session.timedlines.update()
    }, [timedlines])

    useEffect(() => {
        const uhashMap = new Map(
            activeLyric.map((item, idx) => [cyrb53(`${item[0]}-${item[1]}`), idx + 1])
        )

        ;(['primary', 'secondary'] as Array<TimedlinesActions.TimelineTarget>).forEach((target) =>
            timedlines[target]
                .filter(
                    (item) =>
                        uhashMap.get(item.uhash) !== undefined &&
                        uhashMap.get(item.uhash) !== item.displayLineNumber
                )
                .map((item) => ({
                    ...item,
                    displayLineNumber: uhashMap.get(item.uhash) ?? item.linenumber
                }))
                .forEach((item) =>
                    dispatch(
                        TimedlinesActions.update([target, { uhash: item.uhash, content: item }])
                    )
                )
        )
    }, [timedlines, activeLyric, dispatch])

    const lineInTimeline = (uhash: number) =>
        timedlines.primary.findIndex((item) => item.uhash == uhash) !== -1 ||
        timedlines.secondary.findIndex((item) => item.uhash == uhash) !== -1

    const getTimedline = (uhash: number) =>
        timedlines.primary.find((item) => item.uhash == uhash) ||
        timedlines.secondary.find((item) => item.uhash == uhash)

    return (
        <>
            <div className="rounded bg-background-900">
                {activeLyric.map((item, idx) => (
                    <div
                        className="border-background-950 w-[44px] border-y-[1px] flex cursor-default"
                        style={{
                            opacity: lineInTimeline(cyrb53(`${item[0]}-${item[1]}`)) ? '1' : '1'
                        }}
                        key={idx}
                    >
                        <div className="flex items-center justify-center p-2 px-4 h-[44px] w-full">
                            <span className="text-text-300 select-none">{idx + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded bg-background-900">
                {activeLyric.map((i, idx) => (
                    <div
                        className="border-background-950 border-y-[1px] flex w-28 cursor-default"
                        key={idx}
                        data-uhash={cyrb53(`${i[0]}-${i[1]}`)}
                    >
                        <div className="text-center p-2 px-4 w-full h-[44px] ">
                            <span className="text-text-300 select-none">
                                {formattedMS(getTimedline(cyrb53(`${i[0]}-${i[1]}`))?.start)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="rounded bg-background-900">
                {activeLyric.map((item, idx) => (
                    <DragToTimelineComponent
                        uhash={cyrb53(`${item[0]}-${item[1]}`)}
                        content={item[1]}
                        linenumber={item[0]}
                        dragcontent={`${idx + 1}`}
                        key={idx}
                    />
                ))}
            </div>
            <div className="rounded bg-background-900">
                {activeLyric.map((i, idx) => (
                    <div
                        className="border-background-950 border-y-[1px] flex w-28 cursor-default"
                        key={idx}
                    >
                        <div className="text-center p-2 w-full h-[44px] px-4">
                            <span className="text-text-300 select-none">
                                {formattedMS(getTimedline(cyrb53(`${i[0]}-${i[1]}`))?.end)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded bg-background-900">
                {activeLyric.map((i, idx) => (
                    <div
                        className="border-background-950 w-[44px] border-y-[1px] flex cursor-default"
                        key={idx}
                    >
                        <div className="flex items-center justify-center p-2 px-4 h-[44px] w-full">
                            <span className="text-text-300 select-none">{i[0]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default function Page() {
    // const [detailTime, setDetailTime] = useState(1000) // milliseconds
    // const [zoomSize, setZoomSize] = useState(1)

    return (
        <>
            <LocalStoreProvider>
                <StateLoader />

                <div className="flex flex-col items-center gap-4 pb-52 bg-background-base w-screen h-full py-6 overflow-y-auto overflow-x-hidden">
                    <div className="flex gap-1">
                        <LyricsView />
                    </div>

                    <TimelineComponent />
                </div>
            </LocalStoreProvider>
        </>
    )
}
