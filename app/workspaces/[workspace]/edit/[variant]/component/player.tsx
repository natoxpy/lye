'use client'

import PlaybackRate from './playbackRate'
import Scrubber from './scrubber'
import TimeComponent from './TimeComponent'
import PLayPause from './playpause'
import Volume from './volume'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'
import { Milliseconds } from '@/app/utils/units'
import { timeConverter } from '@/app/player/utils'

export default function Component() {
    const { duration, currentTime } = usePlayerState()
    const dispatch = usePlayerDispatch()

    const setCurrentTime = (ms: Milliseconds) => {
        let newtime = ms

        if (ms >= duration) newtime = duration
        else if (ms <= 0) newtime = 0 as Milliseconds

        dispatch({
            type: 'sync-currentTime',
            payload: timeConverter.MStoS(newtime),
        })

        dispatch({
            type: 'set-currentTime',
            payload: newtime,
        })
    }

    return (
        <div className="flex items-center w-full min-h-[50px] bg-bg-3">
            <div className="flex px-[25px] h-[32px] w-full">
                <PlaybackRate />
                <PLayPause />
                <TimeComponent ms={currentTime} />
                <Scrubber
                    onKeyDown={(e) => {
                        console.log(e)
                        if (e.key == 'ArrowRight')
                            setCurrentTime(
                                (currentTime + 5 * 1000) as Milliseconds
                            )
                        else if (e.key == 'ArrowLeft')
                            setCurrentTime(
                                (currentTime - 5 * 1000) as Milliseconds
                            )
                        else if (e.key == '.')
                            setCurrentTime(
                                (currentTime + 1 * 1000) as Milliseconds
                            )
                        else if (e.key == ',')
                            setCurrentTime(
                                (currentTime - 1 * 1000) as Milliseconds
                            )
                    }}
                    onChange={(value) => setCurrentTime(value as Milliseconds)}
                    value={currentTime}
                    max={duration}
                />
                <TimeComponent ms={duration} />
                <Volume />
            </div>
        </div>
    )
}
