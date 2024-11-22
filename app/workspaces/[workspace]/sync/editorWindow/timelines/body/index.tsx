'use client'
import { Layout } from './layout'
import Timeline from '../../../components/timeline/component'
import TickBar from '../../../components/tickbar/component'
import TimelineCursor from '../../../components/timeCursor/component'
import Timelines from '../../../components/timelines/component'
import { Pixels } from '@/app/utils/units'

export default function Component() {
    return (
        <Layout
            timelineCursor={
                <TimelineCursor height={85 as Pixels} leftOffset={96} />
            }
            tickbar={<TickBar />}
            board={
                <Timelines>
                    <Timeline name="main" />
                </Timelines>
            }
        ></Layout>
    )
}
