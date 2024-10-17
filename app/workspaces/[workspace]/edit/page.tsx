'use client'

import { useEffect } from 'react'
import { useDispatch } from './state'

export default function Page({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: 'set-active-workspace',
            payload: { id: undefined },
        })
    })

    return <div className="w-full h-full">{children}</div>
}
