'use client'
import Tickbar from '@/app/components/tickbar'
import { useSynchronizer } from '@/states/hooks'

export default function Page() {
    const { maxwidth, setFrame, offset, duration, frame } = useSynchronizer(
        (state) => state
    )

    return (
        <>
            <Tickbar
                offset={offset}
                duration={duration}
                maxWidth={maxwidth}
                onFrameWidth={(ws, wp) => {
                    if (frame.duration == ws && frame.width == wp) return
                    setFrame({ width: wp, duration: ws })
                }}
            />
        </>
    )
}
