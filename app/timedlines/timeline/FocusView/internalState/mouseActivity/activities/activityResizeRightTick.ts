import { State } from '../..'
import { PxToMs } from '../../../utils/convertion'
import { MINIMUM_DURATION, TickState } from '.'
import { DurationLimitProcedure, NeighborsLimitProcedure } from './activityMoveTick'

/**
 * @param lines mutations will be performed
 */
export function activityResizeRightTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    const duration = lines[index].end - lines[index].start

    const start = lines[index].start
    const end = PxToMs(mousePosition.x, playerDuration, rootWidth)
    let range = {
        start: start,
        end: end
    }

    const procedures = [DurationLimitProcedure, NeighborsLimitProcedure]

    for (const procedure of procedures) {
        const args = { lines, target, playerDuration, lineDuration: duration, mousePosition }
        range = procedure(structuredClone(range), args)
    }

    if (range.end - range.start <= MINIMUM_DURATION) {
        range.start = start
        range.end = start + MINIMUM_DURATION
    }

    lines[index].end = Math.round(range.end)
}
