'use client'
import React, { useEffect } from 'react'
import { Layout } from './layout'
import {
    useBoardManager,
    useTimeline,
} from '@/app/workspaces/[workspace]/sync/states/boardManager'
import BoardItem from '../boardItem/component'
import { Milliseconds } from '@/app/utils/units'

export default function Component({ name }: { name: string }) {
    const manager = useBoardManager()
    const timeline = useTimeline(name)

    useEffect(() => {
        manager.registerTimeline(name)
    })

    return (
        <Layout height={65}>
            {timeline &&
                timeline.items.map((item, key) => (
                    <BoardItem
                        key={key}
                        line={item.line}
                        timelineName={timeline.name}
                        width={(item.right - item.left) as Milliseconds}
                        left={item.left}
                    />
                ))}
        </Layout>
    )
}
