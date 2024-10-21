'use client'

import { useEffect } from 'react'

export default function Page({ children }: { children: React.ReactNode }) {
    // const dispatch = useEditLyricsDispatch()

    useEffect(() => {
        // dispatch({
        //     type: 'set-active-workspace',
        //     payload: { id: undefined },
        // })
    })

    return <div className="w-full h-full">{children}</div>
}
