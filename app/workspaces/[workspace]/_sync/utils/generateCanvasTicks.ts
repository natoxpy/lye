import { Milliseconds } from '@/utils/units'

type Props = {
    config: {
        tickLength: Milliseconds
        inbetweenTicks: number
    }
    player: {
        duration: Milliseconds
    }
    window: {
        timeOffset: Milliseconds
        timeWidth: Milliseconds
    }
}

export class SmallTick {
    constructor(public value: Milliseconds) {}
}

export class BigTick {
    constructor(public value: Milliseconds) {}
}

export default function ticks({
    config: { tickLength: p, inbetweenTicks: b },
    window: { timeOffset: To, timeWidth: Tw },
    player: { duration },
}: Props): Array<SmallTick | BigTick> {
    const lst: Array<SmallTick | BigTick> = []

    const J = Tw,
        H = To,
        pt = p / b,
        K = pt,
        Pi = Math.floor(H / p) * p + p - H,
        G = Math.floor(H / pt) * pt + pt - H,
        bi = (Pi - G) / pt,
        n = Math.floor(J / p)

    let X = G - p

    for (let i = 0; i < bi; i++) {
        lst.push(new SmallTick(X as Milliseconds))
        X += K
    }

    a: for (let j = -1; j <= n; j++) {
        lst.push(new BigTick(X as Milliseconds))

        X += K

        for (let i = 1; i < b; i++) {
            if (To + X >= duration) break a

            lst.push(new SmallTick(X as Milliseconds))
            X += K
        }
    }

    return lst.map((a) => a)
}
