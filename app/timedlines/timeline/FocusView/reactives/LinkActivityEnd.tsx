import { useEffect } from 'react'
import { useInternalDispatch } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        const endActivity = () => {
            dispatch({
                type: 'editor/mouse/activity/update',
                payload: 'idle'
            })

            dispatch({
                type: 'editor/mouse/target/update',
                payload: null
            })

            dispatch({
                type: 'editor/mouse/positionRelativeToTarget/update',
                payload: {
                    x: 0,
                    y: 0
                }
            })
        }

        document.addEventListener('mouseup', endActivity)

        return () => {
            document.removeEventListener('mouseup', endActivity)
        }
    })

    return <></>
}
