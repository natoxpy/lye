import TimelineTicksComponent from './components/TimelineTicksComponent'
import SpaceStepIcon from '@/app/components/icons/SpaceSep'
import { Fragment, useEffect } from 'react'
import { useInternalDispatch, useInternalSelector } from './internalState'

function EditorSlices() {
    const slices = useInternalSelector((state) => state.slices)
    const focusWidth = useInternalSelector((state) => state.page.width * state.page.zoom)
    const dispatch = useInternalDispatch()

    const Divider = ({ idx }: { idx: number }) => (
        <div className="h-32 max-w-[2px] -top-4 opacity-35 relative bg-primary-400 flex justify-center">
            <div
                onMouseDown={() => {
                    dispatch({
                        type: 'mouse/activity/update',
                        payload: 'move'
                    })
                    dispatch({
                        type: 'mouse/target/update',
                        payload: idx
                    })
                }}
                className="flex items-center h-32 min-w-5 cursor-ew-resize"
            >
                <div className="cursor-ew-resize flex items-end pb-1 fill-primary-400 absolute h-12">
                    <SpaceStepIcon width={20} height={12} className="stroke-primary-400" />
                </div>
            </div>
        </div>
    )

    return (
        <>
            {slices.map((slice, idx) => {
                return (
                    <Fragment key={idx}>
                        <div
                            style={{ width: focusWidth * slice.fillRatio + 'px' }}
                            className="flex justify-center items-center overflow-hidden"
                        >
                            <span className="select-none">{slice.content}</span>
                        </div>
                        {slices.length - 1 == idx || <Divider idx={idx} />}
                    </Fragment>
                )
            })}
        </>
    )
}

export default function Component() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        dispatch({
            type: 'slices/compute'
        })
    }, [])

    return (
        <>
            <div className="flex h-6">
                <TimelineTicksComponent
                    start={1000}
                    end={3000}
                    width={700}
                    detailTime={250}
                    edetails={6}
                />
            </div>
            <div className="z-10 flex items-center h-16">
                <EditorSlices />
            </div>
        </>
    )
}
