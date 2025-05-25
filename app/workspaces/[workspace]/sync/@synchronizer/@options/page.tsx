'use client'
import { useSynchronizer } from '@/states/hooks'

export default function Page() {
    const { setMaxwidth, setOffset, offset, duration, maxwidth, frame } =
        useSynchronizer((state) => state)

    return (
        <div className="flex grow items-center justify-center">
            <input
                value={maxwidth}
                onInput={(e) => {
                    const nmw = Number(e.currentTarget.value)
                    const opx = (offset / duration) * maxwidth
                    const u1 = (opx + frame / 2) / maxwidth
                    const opx1 = u1 * nmw - frame / 2
                    const o = (opx1 / nmw) * duration

                    setOffset(o)
                    setMaxwidth(nmw)
                }}
                onMouseUp={() => {
                    if (offset < 0) setOffset(0)
                }}
                type="range"
                min={frame}
                step={1}
                /*
                 Equation comes from `time/duration = frame/maxwidth` solving for `maxwidth`
                 you get `maxwidth = (frame * duration / time)` 
                 */
                max={((frame / 4) * duration) / 1000}
            />
        </div>
    )
}
