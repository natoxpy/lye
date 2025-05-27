'use client'

// The config is here for some reason, too lazy to put it somewhere else
const MinimumComponentTime = 500 // In Milliseconds

import { useAudio } from '@/app/components/audio'
import {
    useLineSync,
    useLyrics,
    useLyricsToolkit,
    useSynchronizer,
} from '@/states/hooks'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLayoutContext } from '../context'
import { Milliseconds } from '@/utils/units'

function AnkerBase({
    children,
    right,
    onDrag,
}: {
    children: React.ReactNode
    right: boolean
    onDrag: (xms: Milliseconds) => void
}) {
    const { container: parentElement } = useLayoutContext()
    const ankerElement = useRef<HTMLDivElement>(null)
    const [mouseDown, setMouseDown] = useState(false)
    const [mouseOffset, setMouseOffset] = useState<null | number>(null)
    const { duration, maxwidth, offset } = useSynchronizer((state) => state)

    const computeTime = useCallback(
        (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const element = ankerElement.current
            if (!element) return

            const parentXRef = parentElement?.current?.getBoundingClientRect().x
            if (parentXRef == undefined) return

            const offsetPx = (offset / duration) * maxwidth

            // Mouse offset
            const moffset = mouseOffset ?? 0
            // mouse adjusted offset
            const maoffset = element.getBoundingClientRect().width - moffset

            const padding = 4

            let x

            // not fully sure where the `extraVariable` comes from, however I suspect it's from the border
            // and it should be affected by changes in sync/synchronizer/layout where the parent of this
            // component can be found, for now as the style currently stands with `p-4` and `border-1` the
            // extraVars listed make the sizeable portion of the sync element not offset simply by placing
            // the mouse down without moving at all.
            if (right) {
                const extraVariable = 1
                x = e.clientX - parentXRef - padding - extraVariable + maoffset
            } else {
                const extraVariable = 2.5
                x = e.clientX - parentXRef - padding - extraVariable - moffset
            }

            const xms = ((offsetPx + x) / maxwidth) * duration
            onDrag((Math.round(xms / 10) * 10) as Milliseconds)
        },
        [parentElement, duration, maxwidth, offset, onDrag, mouseOffset, right]
    )

    useEffect(() => {
        const element = ankerElement.current
        if (!element) return

        const onMouseMove = (e: MouseEvent) => {
            if (!mouseDown) return
            computeTime(e)
        }

        const onMouseUp = (e: MouseEvent) => {
            if (!mouseDown) return

            computeTime(e)

            setMouseDown(false)
            setTimeout(() => setMouseOffset(null), 1)
        }

        const onMouseDown = (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()

            const mouseoffset = e.clientX - element.getBoundingClientRect().x
            setMouseOffset(mouseoffset)
            setMouseDown(true)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        element.addEventListener('mousedown', onMouseDown)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            element.removeEventListener('mousedown', onMouseDown)
        }
    }, [mouseDown, computeTime])

    return (
        <div
            ref={ankerElement}
            onClick={(e) => e.stopPropagation()}
            style={{
                right: right ? '0px' : undefined,
            }}
            className="absolute w-4 h-full"
        >
            {children}
        </div>
    )
}

function LeftSizeResizeAnker({ targetId }: { targetId: string }) {
    const { workspace } = useParams<{ workspace: string }>()
    const { update } = useLineSync((state) => state.actions.lineSyncItems)
    const { findNearestNeighbors } = useLyricsToolkit(workspace)

    const objectPrevious = useLineSync((state) => {
        const { previous } = findNearestNeighbors(targetId)

        return state.workspaces
            .find((w) => w.workspace == workspace)
            ?.content.find((l) => l.targetId == previous?.id)
    })

    const object = useLineSync((state) =>
        state.workspaces
            .find((w) => w.workspace == workspace)
            ?.content.find((l) => l.targetId == targetId)
    )

    return (
        <AnkerBase
            onDrag={(e) => {
                const timerange = object?.timerange
                if (!timerange) return

                let start = e > timerange.end - MinimumComponentTime ? timerange.end - MinimumComponentTime : e
                const end = timerange.end

                if (!objectPrevious) {
                    if (start < 0) start = 0

                    update(workspace, targetId, {
                        start: start,
                        end: timerange.end,
                    })

                    return
                }

                const previousTimeRange = objectPrevious.timerange
                if (!previousTimeRange) return

                const previousStart = previousTimeRange.start
                let previousEnd = previousTimeRange.end

                if (previousEnd > start) previousEnd = start

                if (previousEnd < previousStart + MinimumComponentTime) {
                    previousEnd = previousStart + MinimumComponentTime
                    start = previousEnd
                }

                update(workspace, targetId, { start, end })
                update(workspace, objectPrevious.targetId, {
                    start: previousStart,
                    end: previousEnd,
                })
            }}
            right={false}
        >
            <div className="absolute w-full h-full cursor-ew-resize"></div>
        </AnkerBase>
    )
}

function RightSizeResizeAnker({ targetId }: { targetId: string }) {
    const { workspace } = useParams<{ workspace: string }>()
    const { update } = useLineSync((state) => state.actions.lineSyncItems)
    const { findNearestNeighbors } = useLyricsToolkit(workspace)
    const duration = useSynchronizer((state) => state.duration)

    const object = useLineSync((state) =>
        state.workspaces
            .find((w) => w.workspace == workspace)
            ?.content.find((l) => l.targetId == targetId)
    )

    const objectNext = useLineSync((state) => {
        const { next } = findNearestNeighbors(targetId)

        return state.workspaces
            .find((w) => w.workspace == workspace)
            ?.content.find((l) => l.targetId == next?.id)
    })

    return (
        <AnkerBase
            onDrag={(e) => {
                const timerange = object?.timerange
                if (!timerange) return

                const start = timerange.start
                let end = e < timerange.start + MinimumComponentTime ? timerange.start + MinimumComponentTime : e

                if (!objectNext) {
                    if (end > duration) end = duration

                    update(workspace, targetId, {
                        start: start,
                        end: end,
                    })

                    return
                }

                const nextTimerange = objectNext.timerange
                if (!nextTimerange) return

                let nextStart = nextTimerange.start
                const nextEnd = nextTimerange.end

                if (end > nextStart) nextStart = end

                if (nextStart > nextEnd - MinimumComponentTime) {
                    nextStart = nextEnd - MinimumComponentTime
                    end = nextStart
                }

                update(workspace, targetId, { start, end })
                update(workspace, objectNext.targetId, {
                    start: nextStart,
                    end: nextEnd,
                })
            }}
            right={true}
        >
            <div className="absolute w-full h-full cursor-ew-resize"></div>
        </AnkerBase>
    )
}

function Component({
    content,
    start,
    end,
    targetId,
}: {
    start: number
    end: number
    content: string
    targetId: string
}) {
    const {
        offset,
        duration: TotalDuration,
        maxwidth,
    } = useSynchronizer((state) => state)

    const audio = useAudio()

    const startOffset = (start / TotalDuration) * maxwidth
    const offsetPx = (offset / TotalDuration) * maxwidth

    const duration = end - start

    return (
        <div
            onClick={() => {
                audio.currentTime = start / 1000
            }}
            style={{
                width: `${(duration / TotalDuration) * maxwidth}px`,
                left: `${startOffset - offsetPx}px`,
            }}
            className="flex text-sm items-center justify-between absolute rounded-sm h-16 bg-unaccent-accent-1 hover:border-accent-1 border-bg-2 border-[1px] cursor-pointer text-txt-2"
        >
            <LeftSizeResizeAnker targetId={targetId} />
            <div className="w-full text-center">{content}</div>
            <RightSizeResizeAnker targetId={targetId} />
        </div>
    )
}

export default function Page() {
    const { workspace } = useParams<{ workspace: string }>()
    const lyrics = useLyrics((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )
    const wp = useLineSync((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )

    return (
        <>
            {wp?.content.map((v, i) => {
                const section = lyrics?.lyrics
                    .map((item) =>
                        item.content.find((initem) => initem.id == v.targetId)
                    )
                    .filter((v) => v != undefined)[0]

                if (section == undefined) {
                    // Likely Error
                    //
                    // Lyrics Line was removed but it's linesync
                    // line which uses it was not cleaned
                    console.error('section should not be undefined')
                    return <></>
                }

                return (
                    <Component
                        start={v.timerange.start}
                        end={v.timerange.end}
                        content={section.content}
                        targetId={v.targetId}
                        key={i}
                    />
                )
            })}
        </>
    )
}
