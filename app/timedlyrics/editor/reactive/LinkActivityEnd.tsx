import { useEffect } from 'react'
import { useInternalDispatch } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        const endActivity = () => {
            dispatch({
                type: 'mouse/activity/update',
                payload: 'idle'
            })

            dispatch({
                type: 'mouse/target/update',
                payload: null
            })
        }

        document.addEventListener('mouseup', endActivity)

        return () => {
            document.removeEventListener('mouseup', endActivity)
        }
    })

    return <></>
}
