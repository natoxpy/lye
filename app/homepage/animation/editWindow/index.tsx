'use client'
import { useGSAP } from '@gsap/react'
import Layout from './layout'
import { useRef } from 'react'
import gsap, { SteppedEase } from 'gsap'
import CursorIcon from '../assets/icons/cursor'

export default function Window() {
    const root = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            // gsap.registerPlugin(TextPlugin)
            const tl = gsap.timeline({ repeat: 5, repeatDelay: 1 })

            tl.fromTo(
                '.cursor-header-1',
                { autoAlpha: 0, x: -20 },
                {
                    autoAlpha: 1,
                    duration: 0.5,
                    repeat: -1,
                    ease: SteppedEase.config(1),
                }
            )

            gsap.to('#text-header-1', {
                text: { value: 'Hello World' },
                duration: 5,
                delay: 1,
                ease: 'none',
            })

            // tl.set('.cursor', { x: 528, y: 272, opacity: 1 })
            // tl.to('.cursor', { x: 100, y: 100, duration: 1 })
            // tl.to('.cursor', { x: 200, y: 100, duration: 1 })
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
            body={
                <>
                    <Layout.line header>
                        <span id="text-header-1"></span>
                        <CursorIcon
                            className="cursor-header-1 absolute"
                            style={{ opacity: 0 }}
                        />
                    </Layout.line>

                    <Layout.line line={1}>
                        <span>Hello</span>
                    </Layout.line>
                </>
            }
        />
    )
}
