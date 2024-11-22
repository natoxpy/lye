'use client'
import React, { useEffect } from 'react'
import { Layout } from './layout'
import {
    useBoardManager,
    useTimeline,
} from '@/app/workspaces/[workspace]/sync/states/boardManager'
import BoardItem from '../boardItem/component'

export default function Component({ name }: { name: string }) {
    const manager = useBoardManager()
    const timeline = useTimeline(name)

    useEffect(() => {
        manager.registerTimeline(name)
    })

    useEffect(() => {
        console.log(timeline)
    }, [timeline])

    return (
        <Layout height={36}>
            {timeline &&
                timeline.items.map((item, key) => (
                    <BoardItem
                        key={key}
                        line={item.line}
                        timelineName={timeline.name}
                        weight={item.width}
                        left={item.left}
                    />
                ))}
        </Layout>
    )
}
