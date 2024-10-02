import { useEffect } from 'react'
import { useInternalDispatch } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        const div = document.querySelector<HTMLDivElement>('#timedlyrics-editor-root')

        const resize = () => {
            const boundary = div?.getBoundingClientRect()
            if (boundary === undefined) return

            dispatch({
                type: 'page/root/left/update',
                payload: boundary.left
            })
        }

        resize()

        window.addEventListener('resize', resize)

        return () => window.removeEventListener('resize', resize)
    }, [])

    return <></>
}
