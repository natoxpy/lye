'use client'
import { useAudio } from '@/app/components/audio'
import { useSynchronizer } from '@/states/hooks'
import PlayIcon from '@/app/components/icons/play'
import PauseIcon from '@/app/components/icons/pause'

export default function Page() {
    const { setMaxwidth, setOffset, offset, duration, maxwidth, frame } =
        useSynchronizer((state) => state)

    const audio = useAudio()

    return (
        <div className="flex grow items-center justify-center">
            <div
                style={{
                    pointerEvents: audio.duration == 0 ? 'none' : 'initial',
                }}
                onClick={() => {
                    if (audio.paused) audio.play()
                    else audio.pause()
                }}
                className="flex items-center justify-center group/playbtn h-[50px] w-[80px] cursor-pointer"
            >
                {audio.paused ? (
                    <PlayIcon
                        widths={50}
                        className="stroke-txt-3 group-hover/playbtn:stroke-txt-2"
                    />
                ) : (
                    <PauseIcon
                        widths={50}
                        className="stroke-txt-3 group-hover/playbtn:stroke-txt-2"
                    />
                )}
            </div>
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
                min={frame * 2}
                step={1}
                /*
                 Equation comes from `time/duration = frame/maxwidth` solving for `maxwidth`
                 you get `maxwidth = (frame * duration / time)` 
                 */
                max={((frame / 3) * duration) / 1000}
            />
        </div>
    )
}
