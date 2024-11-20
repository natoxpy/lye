import { usePlayerState } from '@/app/player/state'
import { useBoardManager } from '../../../../states/boardManager'
import generateTicks from '../../../../utils/generateCanvasTicks'

export function useTicks() {
    const { offset, width, tickLength, inbetweenTicks } = useBoardManager()
    const { duration } = usePlayerState()

    const ticks = generateTicks({
        config: {
            tickLength,
            inbetweenTicks,
        },
        player: {
            duration,
        },
        window: {
            timeOffset: offset.ms,
            timeWidth: width.ms,
        },
    })

    return { ticks }
}
