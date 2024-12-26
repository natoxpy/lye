'use client'
import Layout from './layout'
import EditWindow from './editWindow'
import { useState } from 'react'

function AnimationController({
    active,
    nextAnimation,
    resetAnimation,
}: {
    active: number
    nextAnimation: () => void
    resetAnimation: () => void
}) {
    switch (active) {
        case 0:
            return <EditWindow nextAnimation={nextAnimation} />
        default:
            setTimeout(() => {
                resetAnimation()
            })
            return <span>No</span>
    }
}

export default function Animation() {
    const [animationState, setAnimationState] = useState(0)
    const nextAnimation = () => setAnimationState((state) => state + 1)
    const resetAnimation = () => setAnimationState(0)

    return (
        <Layout>
            <AnimationController
                active={animationState}
                nextAnimation={nextAnimation}
                resetAnimation={resetAnimation}
            />
        </Layout>
    )
}
