import { useEffect } from 'react'
import { useInternalDispatch } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        const updateAbsolutePosition = (event: MouseEvent) => {
            dispatch({
                type: 'mouse/absolutePosition/update',
                payload: {
                    x: event.clientX,
                    y: event.clientY
                }
            })
        }

        document.addEventListener('mousemove', updateAbsolutePosition)

        return () => {
            document.removeEventListener('mousemove', updateAbsolutePosition)
        }
    })

    return <></>
}
