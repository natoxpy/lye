///
/// The Internal State contains all the neccesary data, updates can be performed internally
/// by the reducers, that's what ticks are fall, to tell it when to start performing those updates
///
import { useEffect } from 'react'
import { useInternalDispatch, useInternalSelector } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()
    const activity = useInternalSelector((state) => state.editor.mouse.activity)

    useEffect(() => {
        const tick = () => {
            if (activity === 'idle') return

            dispatch({
                type: 'editor/mouse/activity/tick'
            })
        }

        document.addEventListener('mousemove', tick)
        return () => {
            document.removeEventListener('mousemove', tick)
        }
    }, [activity])

    return <></>
}
