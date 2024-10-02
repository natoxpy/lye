import { UHash } from '@/app/cachedb'
import LineComponent from './components/LineComponent'
import { MouseActivities, useInternalDispatch, useInternalSelector } from './internalState'
import React from 'react'
import { MsToPx } from './utils/convertion'
import { LEFT_SIDE_WIDTH } from './utils/consts'

export default function Component() {
    const lines = useInternalSelector((state) => state.lines)
    const duration = useInternalSelector((state) => state.player.duration)
    const width = useInternalSelector((state) => state.root.width)

    const dispatch = useInternalDispatch()

    const triggerActivity = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        activity: MouseActivities,
        target: UHash
    ) => {
        if (duration === undefined || width === undefined) return
        const lineStart = lines.find((item) => item.uhash === target)?.start
        if (lineStart === undefined) return

        const itemLeft = MsToPx(lineStart, duration, width)
        const clientX = e.clientX - LEFT_SIDE_WIDTH

        if (activity == 'move')
            dispatch({
                type: 'editor/mouse/positionRelativeToTarget/update',
                payload: {
                    x: itemLeft - clientX,
                    y: e.clientY
                }
            })

        dispatch({
            type: 'editor/mouse/activity/update',
            payload: activity
        })

        dispatch({
            type: 'editor/mouse/target/update',
            payload: target
        })
    }

    if (duration === undefined || width === undefined) return <></>

    return (
        <>
            {lines.map((line, idx) => (
                <LineComponent
                    key={idx}
                    line={line}
                    duration={duration}
                    width={width}
                    triggerActivity={triggerActivity}
                />
            ))}
        </>
    )
}
