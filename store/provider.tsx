'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, store } from './store'
import { useAppDispatch, useAppSelector } from './hooks'
import { createVariant } from './stores/lyrics/reducer'
import { TemporaryWorkspaceID } from './stores/workspaces/reducer'
import { useVariants } from './stores/lyrics'

function DefaultValues() {
    const variants = useAppSelector(useVariants('main'))
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (variants.length == 0)
            dispatch(
                createVariant({
                    name: 'original',
                    workspace: TemporaryWorkspaceID,
                    id: 'original',
                })
            )
    }, [variants, dispatch])

    return <></>
}

export default function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) storeRef.current = store

    return (
        <Provider store={storeRef.current}>
            <DefaultValues />

            {children}
        </Provider>
    )
}
