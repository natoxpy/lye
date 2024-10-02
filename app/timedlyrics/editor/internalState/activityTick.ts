import { State } from '.'

/**
 * @param state mutations will be performed
 * StructuredClone isn't performed here because it expects the function
 * calling this function to do it and pass a referenced of the structuredCloned State
 */
export function ActivityTickReducer(state: State) {
    if (state.mouse.target === null) return

    const x = state.mouse.absolutePosition.x - state.page.root.left
    let ratio = x / state.page.width

    const gapMs = 500
    let maxRatio = 1
    let minRatio = 0

    const left = state.dividers[state.mouse.target - 1]
    if (left) minRatio = (left.time + gapMs) / state.player.duration

    const right = state.dividers[state.mouse.target + 1]
    if (right) maxRatio = (right.time - gapMs) / state.player.duration

    if (ratio <= minRatio) ratio = minRatio
    else if (ratio >= maxRatio) ratio = maxRatio

    state.dividers[state.mouse.target].time = Math.floor(ratio * state.player.duration)
}
