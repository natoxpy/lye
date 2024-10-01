import { useEffect } from 'react'
import { useInternalDispatch } from '../internalState'

export default function ReactiveComponent() {
    const dispatch = useInternalDispatch()

    useEffect(() => {
        const focusViewRoot = document.querySelector('#focusview-root')

        dispatch({
            type: 'root/width/update',
            payload: focusViewRoot?.getBoundingClientRect().width
        })

        const updateRootWidth = () => {
            const width = focusViewRoot?.getBoundingClientRect().width

            dispatch({
                type: 'root/width/update',
                payload: width
            })
        }

        window.addEventListener('resize', updateRootWidth)

        return () => {
            window.removeEventListener('resize', updateRootWidth)
        }
    })

    return <></>
}
