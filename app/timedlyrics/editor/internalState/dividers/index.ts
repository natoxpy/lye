import _ from 'lodash'
import { SpacelessString } from '../../SpacelessString'
import { type State, type Action } from '../index'

/**
 * @param state mutations will be performed
 */
function ComputeSlices(state: State) {
    if (state.lyric === undefined) return
    const slyric = SpacelessString.from(state.lyric)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lst: any[] = []
    let offset = 0
    let timeOffset = 0

    const dividers = state.dividers.sort((a, b) => a.leftOffset - b.leftOffset)

    for (const divider of dividers) {
        const content = slyric.spacelessSlice(offset, divider.leftOffset).toString().trim()
        const fillRatio = (divider.time - timeOffset) / state.player.duration

        lst.push({ content, fillRatio })
        offset = divider.leftOffset
        timeOffset = divider.time
    }

    const content = slyric.spacelessSlice(offset).toString().trim()
    const fillRatio = (state.player.duration - timeOffset) / state.player.duration
    lst.push({ content, fillRatio })

    if (_.isEqual(state.slices, lst)) return
    state.slices = lst
}

/**
 * @param state mutations will be performed
 * StructuredClone isn't performed here because it expects the function
 * calling this function to do it and pass a referenced of the structuredCloned State
 */
export function dividersReducer(state: State, action: Action) {
    switch (action.type) {
        case 'slices/compute':
            ComputeSlices(state)
            break

        case 'dividers/remove':
            state.dividers = state.dividers.filter((state) => state.leftOffset !== action.payload)
            break

        case 'dividers/put': {
            if (state.lyric === undefined) return
            const index = state.dividers.findIndex(
                (divider) => divider.leftOffset == action.payload.leftOffset
            )

            const slyric = SpacelessString.from(state.lyric)

            const gap = 500
            let max = 1
            let min = 0

            const left = state.dividers
                .filter((divider) => divider.leftOffset < action.payload.leftOffset)
                .pop()

            const right = state.dividers
                .filter((divider) => divider.leftOffset > action.payload.leftOffset)
                .shift()

            if (left) min = (left.time + gap) / state.player.duration
            if (right) max = (right.time - gap) / state.player.duration

            let timeRatio = action.payload.leftOffset / slyric.content.length

            if (timeRatio <= min) timeRatio = min
            else if (timeRatio >= max) timeRatio = max

            const divider = {
                ...action.payload,
                time: timeRatio * state.player.duration
            }

            if (index !== -1) state.dividers[index] = divider
            else {
                state.dividers.push(divider)
            }

            state.dividers = state.dividers.sort((a, b) => a.leftOffset - b.leftOffset)

            break
        }
    }
}
