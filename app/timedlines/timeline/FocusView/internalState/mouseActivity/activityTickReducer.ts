import { State } from '../index'
import { LEFT_SIDE_WIDTH } from '../../utils/consts'
import { activityMoveTick, activityResizeLeftTick, activityResizeRightTick } from './activities'

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
