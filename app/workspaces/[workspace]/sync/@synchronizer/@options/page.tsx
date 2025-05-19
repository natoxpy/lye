'use client'
import { useSynchronizer } from '@/states/hooks'

export default function Page() {
    const { frame, duration, setMaxwidth, offset, setOffset, maxwidth } =
        useSynchronizer((state) => state)

    return (
        <div className="flex grow items-center justify-center">
            <input
                onInput={(e) => {
                    const offsetPx = (offset / duration) * maxwidth
                    console.log(offsetPx / maxwidth)

                    // const value = Number(e.currentTarget.value)

                    // setMaxwidth(maxwidth - 10)
                    // setOffset(((offsetPx - 5) / maxwidth) * duration)

                    // setMaxwidthFromDuration(nmw)
                }}
                value={frame.duration / duration}
                type="range"
                min="0.01"
                step="0.00001"
                max="1"
            />
        </div>
    )
}
