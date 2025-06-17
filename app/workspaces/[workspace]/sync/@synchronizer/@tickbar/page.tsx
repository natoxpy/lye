'use client'
import Tickbar from '@/app/components/tickbar'
import { useSynchronizer } from '@/states/hooks'
import { useAudio } from '@/app/components/audio'

export default function Page() {
    const { maxwidth, setFrame, offset, duration, frame } = useSynchronizer(
        (state) => state
    )
    const audio = useAudio()

    return (
        <>
            <Tickbar
                offset={offset}
                duration={duration}
                maxWidth={maxwidth}
                onFrameWidth={(wp) => {
                    if (frame == wp) return
                    setFrame(wp)
                }}
                onClick={(ms) => (audio.currentTime = ms / 1000)}
                onDrag={(ms) => (audio.currentTime = ms / 1000)}
            />
        </>
    )
}
