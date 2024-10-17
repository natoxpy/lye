'use client'

import PlaybackRate from './playbackRate'
import Scrubber from './scrubber'
import TimeComponent from './TimeComponent'
import PLayPause from './playpause'
import Volume from './volume'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'

export default function Component() {
    const { duration, currentTime } = usePlayerState()
    const dispatch = usePlayerDispatch()
    const setCurrentTime = (valueMS: number) => {
        let value = valueMS

        if (valueMS >= duration) value = duration
        else if (valueMS <= 0) value = 0

        dispatch({
            type: 'sync-currentTime',
            payload: value / 1000,
        })

        dispatch({
            type: 'set-currentTime',
            payload: value,
        })
    }

    return (
        <div className="flex items-center w-full min-h-[50px] bg-bg-3">
            <div className="flex px-[25px] h-[32px] w-full">
                <PlaybackRate />
                <PLayPause />
                <TimeComponent milliseconds={currentTime} />
                <Scrubber
                    onKeyDown={(e) => {
                        console.log(e)
                        if (e.key == 'ArrowRight')
                            setCurrentTime(currentTime + 5 * 1000)
                        else if (e.key == 'ArrowLeft')
                            setCurrentTime(currentTime - 5 * 1000)
                        else if (e.key == '.')
                            setCurrentTime(currentTime + 1 * 1000)
                        else if (e.key == ',')
                            setCurrentTime(currentTime - 1 * 1000)
                    }}
                    onChange={(value) => setCurrentTime(value)}
                    value={currentTime}
                    max={duration}
                />
                <TimeComponent milliseconds={duration} />
                <Volume />
            </div>
        </div>
    )
}
