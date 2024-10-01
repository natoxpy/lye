import { UHash } from '@/app/cachedb'
import { State } from '../..'

export { activityMoveTick } from './activityMoveTick'
export { activityResizeLeftTick } from './activityResizeLeftTick'
export { activityResizeRightTick } from './activityResizeRightTick'

export const MINIMUM_DURATION = 5 * 1000

export type TickState = {
    target: UHash
    mousePosition: { x: number; y: number }
    playerDuration: number
    rootWidth: number
}

export type ProcedureArgs = {
    lines: State['lines']
    target: UHash
    playerDuration: number
    lineDuration: number
    mousePosition: { x: number; y: number }
}

export function getLineNeighbors(
    { lines, target }: ProcedureArgs,
    timeline?: State['lines'][0]['timeline']
) {
    const lineRef = lines.find((item) => item.uhash === target)!

    if (timeline === undefined) timeline = lineRef.timeline

    const leftLineRef = lines
        .filter((line) => line.line < lineRef.line && line.timeline == timeline)
        .sort((a, b) => a.line - b.line)
        .pop()

    const rightLineRef = lines
        .filter((line) => line.line > lineRef.line && line.timeline == timeline)
        .sort((a, b) => b.line - a.line)
        .pop()

    return { leftLineRef, rightLineRef }
}
