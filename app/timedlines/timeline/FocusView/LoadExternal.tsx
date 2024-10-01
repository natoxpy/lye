///
/// This component is allowed to access external state
///
/// This component can only be called by component.tsx
/// to not contaminate all components with impure behavior
///

import { TimedLinesLine } from '@/app/cachedb/timedlines'
import { Line, useInternalDispatch, useInternalSelector } from './internalState'
import { useAppSelector } from '@/lib/hooks'
import { useEffect } from 'react'

function LinkPlayerState() {
    const dispatch = useInternalDispatch()
    const currentTime = useAppSelector((state) => state.audioPlayer.audio?.currentTime ?? 0)
    const duration = useAppSelector((state) => state.audioPlayer.audio?.duration ?? 0)
    const paused = useAppSelector((state) => state.audioPlayer.audio?.paused ?? true)

    useEffect(() => {
        dispatch({
            type: 'player/currentTime/update',
            payload: currentTime
        })
    }, [currentTime])

    useEffect(() => {
        dispatch({
            type: 'player/duration/update',
            payload: duration
        })
    }, [duration])

    useEffect(() => {
        dispatch({
            type: 'player/paused/update',
            payload: paused
        })
    }, [paused])

    return <></>
}

export default function Component() {
    const internalDispatch = useInternalDispatch()
    const timedlines = useAppSelector((state) => state.timedlines)
    const inlines = useInternalSelector((state) => state.lines)

    const toLine = (line: TimedLinesLine, timeline: Line['timeline']): Line => ({
        start: line.start,
        end: line.end,
        displayLine: line.displayLineNumber,
        line: line.linenumber,
        uhash: line.uhash,
        timeline
    })

    useEffect(() => {
        if (inlines.length !== 0) return

        const lines: Line[] = [
            ...timedlines.primary.map((line) => toLine(line, 'primary')),
            ...timedlines.secondary.map((line) => toLine(line, 'secondary'))
        ]

        internalDispatch({ type: 'lines/load', payload: lines })
    })

    return (
        <>
            <LinkPlayerState />
        </>
    )
}
