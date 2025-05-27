import { Milliseconds, Seconds, TimeUnit } from '@/utils/units'

export const timeConverter = {
    StoMS(s: Seconds): Milliseconds {
        return (s * 1000) as Milliseconds
    },

    MStoS(ms: Milliseconds): Seconds {
        return (ms / 1000) as number as Seconds
    },
}

export function round<T extends TimeUnit>(time: T): T {
    return Math.round(time) as T
}

export function floor<T extends TimeUnit>(time: T): T {
    return Math.round(time) as T
}
