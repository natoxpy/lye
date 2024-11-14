'use client'
import { useGSAP } from '@gsap/react'
import Layout from './layout'
import { useRef } from 'react'
import gsap from 'gsap'
import CursorIcon from '../assets/icons/cursor'

export default function Window() {
    const root = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const tl = gsap.timeline({ repeat: 5, repeatDelay: 1 })

            tl.set('.cursor', { x: 528, y: 272, opacity: 1 })
            tl.to('.cursor', { x: 100, y: 100, duration: 1 })
            tl.to('.cursor', { x: 200, y: 100, duration: 1 })
        },
        { scope: root }
    )

    return (
        <Layout.root
            ref={root}
            cursor={<CursorIcon className="cursor" style={{ opacity: 0 }} />}
            navigation={<></>}
            variantNavigation={
                <>
                    <Layout.variant name="Original" selected />
                    <Layout.variant name="English" />
                </>
            }
        />
    )
}
