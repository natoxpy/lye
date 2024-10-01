import { State } from '../..'
import { PxToMs } from '../../../utils/convertion'
import { getLineNeighbors, ProcedureArgs, TickState } from '.'

export function DurationLimitProcedure(
    state: { start: number; end: number },
    { playerDuration, lineDuration }: ProcedureArgs
): { start: number; end: number } {
    if (state.start <= 0) {
        return {
            start: 0,
            end: lineDuration
        }
    }

    if (state.start + lineDuration >= playerDuration) {
        return {
            start: playerDuration - lineDuration,
            end: playerDuration
        }
    }

    return state
}

export function NeighborsLimitProcedure(
    state: { start: number; end: number },
    args: ProcedureArgs
): { start: number; end: number } {
    const { lineDuration } = args

    const { leftLineRef, rightLineRef } = getLineNeighbors(args)

    if (leftLineRef && leftLineRef.end >= state.start) {
        return {
            start: leftLineRef.end,
            end: leftLineRef.end + lineDuration
        }
    }

    if (rightLineRef && rightLineRef.start < state.end) {
        return {
            start: rightLineRef.start - lineDuration,
            end: rightLineRef.start
        }
    }

    return state
}

function CalculateAvailableSpace(timeline: State['lines'][0]['timeline'], args: ProcedureArgs) {
    const { playerDuration } = args

    const { leftLineRef, rightLineRef } = getLineNeighbors(args, timeline)

    if (leftLineRef === undefined && rightLineRef !== undefined) {
        return rightLineRef.start
    }

    if (leftLineRef !== undefined && rightLineRef === undefined) {
        return playerDuration - leftLineRef.end
    }

    if (leftLineRef !== undefined && rightLineRef !== undefined) {
        return rightLineRef.start - leftLineRef.end
    }

    return playerDuration
}

function CrossTimelineProcedure(state: { start: number; end: number }, args: ProcedureArgs) {
    const { lines, target, mousePosition, lineDuration } = args
    const lineRef = lines.find((item) => item.uhash === target)!
    const oppositeTimeline = lineRef.timeline == 'primary' ? 'secondary' : 'primary'
    const height = document.body.getBoundingClientRect().height

    const availableSpace = CalculateAvailableSpace(oppositeTimeline, args)

    if (availableSpace < lineDuration) return state

    if (height - 36 > mousePosition.y) lineRef.timeline = 'primary'
    else lineRef.timeline = 'secondary'

    return state
}

/**
 * @param lines mutations will be performed
 */
export function activityMoveTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    const duration = lines[index].end - lines[index].start

    const start = PxToMs(mousePosition.x, playerDuration, rootWidth)
    let range = { start, end: start + duration }

    const procedures = [DurationLimitProcedure, CrossTimelineProcedure, NeighborsLimitProcedure]

    for (const procedure of procedures) {
        const args = { lines, target, playerDuration, lineDuration: duration, mousePosition }
        range = procedure(structuredClone(range), args)
    }

    lines[index].start = Math.round(range.start)
    lines[index].end = Math.round(range.end)
}
