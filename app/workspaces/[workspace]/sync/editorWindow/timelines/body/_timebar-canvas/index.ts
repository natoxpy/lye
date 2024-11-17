import { formatMS } from '@/app/utils/time'
import { Dispatch, SetStateAction } from 'react'

export const colors = {
    unaccented_1: 'rgb(45,51,57)',
    text_3: 'rgb(101,115,125)',
}

export type Props = {
    canvas: {
        canvas: HTMLCanvasElement
        ctx: CanvasRenderingContext2D
        width: number
        height: number
    }
    player: {
        duration: number
    }
    window: {
        timeOffset: number
        timeWidth: number
    }
    state: {
        setVisibleMarks: Dispatch<SetStateAction<number[]>>
    }
}

function clear({ canvas: { ctx, width, height } }: Props) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = colors.unaccented_1
}

function ticks({
    canvas: { ctx, width },
    window: { timeOffset: To, timeWidth: Tw },
    player: { duration },
}: Props) {
    const timeToPx = (t: number) => (t / Tw) * width
    const lst = []

    const J = Tw,
        H = To,
        p = 10_000,
        b = 25,
        pt = p / b,
        K = pt,
        Pi = Math.floor(H / p) * p + p - H,
        G = Math.floor(H / pt) * pt + pt - H,
        bi = (Pi - G) / pt,
        n = Math.floor(J / p)

    let X = G - p

    for (let i = 0; i < bi; i++) {
        ctx.fillRect(timeToPx(X), 0, 1, 8)
        lst.push(X)
        X += K
    }
    ctx.font = '12px Inter, serif'

    a: for (let j = -1; j <= n; j++) {
        ctx.fillRect(timeToPx(X), 0, 1, 20)
        lst.push(X)
        ctx.fillStyle = colors.text_3
        ctx.fillText(formatMS(H + X), timeToPx(X) + 5, 23)
        ctx.fillStyle = colors.unaccented_1

        X += K

        for (let i = 1; i < b; i++) {
            if (To + X >= duration) break a

            ctx.fillRect(timeToPx(X), 0, 1, 8)
            lst.push(X)
            X += K
        }
    }

    return lst.map((a) => a)
}

export default function redraw(props: Props) {
    clear(props)
    const visibleMarks = ticks(props)
    props.state.setVisibleMarks(visibleMarks)
}
