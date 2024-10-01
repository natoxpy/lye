import { State } from '../..'
import { PxToMs } from '../../../utils/convertion'
import { TickState, MINIMUM_DURATION } from '.'
import { DurationLimitProcedure, NeighborsLimitProcedure } from './activityMoveTick'

/**
 * @param lines mutations will be performed
 */
export function activityResizeLeftTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    const duration = lines[index].end - lines[index].start
    const start = PxToMs(mousePosition.x, playerDuration, rootWidth)
    const end = lines[index].end
    let range = { start: start, end: end }

    const procedures = [DurationLimitProcedure, NeighborsLimitProcedure]

    for (const procedure of procedures) {
        const args = { lines, target, playerDuration, lineDuration: duration, mousePosition }
        range = procedure(structuredClone(range), args)
    }

    if (range.end - range.start <= MINIMUM_DURATION) {
        range.end = end
        range.start = end - MINIMUM_DURATION
    }

    lines[index].start = Math.round(range.start)
}
