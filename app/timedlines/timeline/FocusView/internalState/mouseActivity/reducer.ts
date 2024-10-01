import { State, Action } from '../index'
import { mouseActivityTickReducer } from './activityTickReducer'

/**
 * @param state mutations will be performed
 * StructuredClone isn't performed here because it expects the function
 * calling this function to do it and pass a referenced of the structuredCloned State
 */
export function mouseActivityReducer(state: State, action: Action) {
    switch (action.type) {
        case 'editor/mouse/positionRelativeToTarget/update':
            state.editor.mouse.positionRelativeToTarget = action.payload
            break
        case 'editor/mouse/activity/update':
            state.editor.mouse.activity = action.payload
            break
        case 'editor/mouse/target/update':
            state.editor.mouse.target = action.payload
            break
        case 'editor/mouse/absolutePosition/update':
            state.editor.mouse.absolutePosition = action.payload
            break
        case 'editor/mouse/activity/tick':
            mouseActivityTickReducer(state)
            break
    }
}
