import PlayIcon from '@/app/components/icons/play'
import PauseIcon from '@/app/components/icons/pause'
import { useInternalSelector, useInternalDispatch } from './internalState'
import { Button } from '@mantine/core'

export default function Component() {
    const pageState = useInternalSelector((state) => state.page.state)
    const dispatch = useInternalDispatch()

    const paused = false

    return (
        <div className="flex min-h-8 bg-background-900 border-y-2 border-background-base w-full">
            <div
                className="flex items-center justify-center h-full py-1 w-12 cursor-pointer"
                onClick={() => {
                    // if (paused) {
                    //     dispatch(AudioPlayerActions.play())
                    //     dispatch(AudioPlayerActions.setCurrentTime(Math.floor(start / 1000)))
                    // } else dispatch(AudioPlayerActions.pause())
                }}
            >
                {paused ? (
                    <PlayIcon className="stroke-text-300" />
                ) : (
                    <PauseIcon className="stroke-text-300" />
                )}
            </div>
            <div className="h-full w-16 flex justify-center items-center">
                <Button
                    onClick={() => {
                        dispatch({
                            type: 'page/state/update',
                            payload:
                                pageState !== 'dividerEditor' ? 'dividerEditor' : 'dividerSpacing'
                        })
                    }}
                    color="gray"
                    size="xs"
                >
                    M
                </Button>
            </div>
        </div>
    )
}
