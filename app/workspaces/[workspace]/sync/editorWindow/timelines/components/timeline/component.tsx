'use client'
import React, { useEffect } from 'react'
import { Layout } from './layout'
import { useBoardManager } from '@/app/workspaces/[workspace]/sync/states/boardManager'

export default function Component({ name }: { name: string }) {
    const manager = useBoardManager()

    useEffect(() => {
        manager.registerTimeline(name)
    })

    return <Layout></Layout>
}
