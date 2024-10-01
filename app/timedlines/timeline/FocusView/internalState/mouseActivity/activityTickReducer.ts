import { UHash } from '@/app/cachedb'
import { State } from '../index'
import { PxToMs } from '../../utils/convertion'
import { LEFT_SIDE_WIDTH } from '../../utils/consts'

type TickState = {
    target: UHash
    mousePosition: { x: number; y: number }
    playerDuration: number
    rootWidth: number
}

/**
 * @param lines mutations will be performed
 */
function activityMoveTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    const duration = lines[index].end - lines[index].start

    let start = PxToMs(mousePosition.x, playerDuration, rootWidth)

    if (start <= 0) start = 0

    lines[index].start = start
    lines[index].end = start + duration
}

/**
 * @param lines mutations will be performed
 */
function activityResizeLeftTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    lines[index].start = PxToMs(mousePosition.x, playerDuration, rootWidth)
}

/**
 * @param lines mutations will be performed
 */
function activityResizeRightTick(
    lines: State['lines'],
    { target, mousePosition, playerDuration, rootWidth }: TickState
) {
    const index = lines.findIndex((line) => line.uhash === target)
    if (index === -1) return

    lines[index].end = PxToMs(mousePosition.x, playerDuration, rootWidth)
}

/**
 * @param state mutations will be performed
 */
export function mouseActivityTickReducer(state: State) {
    if (
        state.editor.mouse.target === null ||
        state.player.duration === undefined ||
        state.root.width === undefined
    )
        return

    const tickState = {
        target: state.editor.mouse.target,
        mousePosition: {
            x:
                state.editor.mouse.absolutePosition.x -
                LEFT_SIDE_WIDTH +
                state.editor.mouse.positionRelativeToTarget.x,
            y: state.editor.mouse.absolutePosition.y
        },
        playerDuration: state.player.duration,
        rootWidth: state.root.width
    }

    switch (state.editor.mouse.activity) {
        case 'idle':
            break
        case 'move':
            activityMoveTick(state.lines, tickState)
            break
        case 'resize-left':
            activityResizeLeftTick(state.lines, tickState)
            break
        case 'resize-right':
            activityResizeRightTick(state.lines, tickState)
            break
    }
}
