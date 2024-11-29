'use client'
import { useGSAP } from '@gsap/react'
import Layout from './layout'
import { useRef, useState } from 'react'
import gsap, { SteppedEase } from 'gsap'
import CursorIcon from '../assets/icons/cursor'
import TypingCursorIcon from '../assets/icons/typingCursor'
import { ScrollToPlugin, TextPlugin } from 'gsap/all'

export default function Window() {
    const root = useRef<HTMLDivElement>(null)
    const [lyrics] = useState<
        { content: string; line: number; header?: boolean }[]
    >([
        { line: 1, content: 'Verse', header: true },
        { line: 1, content: 'Frozen stairs, carptet in blood red' },
        {
            line: 2,
            content: 'Seating goodbyes left unsaid, goodbyes left unsaid',
        },
        {
            line: 3,
            content: 'Dispite our promisees, here I am following your steps',
        },
        { line: 4, content: 'Verse 2', header: true },
        { line: 4, content: 'Drop by drop' },
        { line: 5, content: 'As your unchanging reality dampen my sleeve' },
        { line: 6, content: 'You kisssed them off' },
        { line: 7, content: 'Through the fibers of my handkercheif' },
        { line: 8, content: 'Chorus', header: true },
        { line: 8, content: 'I am fire' },
        { line: 9, content: 'Burn those who dare to care for me' },
        {
            line: 10,
            content: 'And my fuel are memories, fuel are memories of you',
        },
        {
            line: 11,
            content: 'They parish with the heat, parish with the heat',
        },
        {
            line: 12,
            content: 'So I can move on',
        },
    ])

    const constantType = (target: string, value: string, perchar: number) => {
        return gsap.to(target, {
            text: { value },
            duration: value.length * perchar,
        })
    }

    const CursorAnimation = (target: string, repeats: number) => {
        if (repeats == 0) return gsap.to(target, { opacity: 1, duration: 0 })

        return gsap.fromTo(
            target,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: 1,
                repeat: repeats,
                ease: SteppedEase.config(1),
            }
        )
    }

    const WriteLine = (
        cursor: string,
        cursorRepeat: number,
        line: string,
        content: string
    ) => {
        const tl = gsap.timeline()

        tl.add(CursorAnimation(cursor, cursorRepeat))
        tl.add(constantType(line, content, 0.012))
        tl.to(cursor, { opacity: 1, duration: 0.1 })
        tl.to(cursor, { opacity: 0, duration: 0 })

        return tl
    }

    const TypingLines = () => {
        const tl = gsap.timeline({})
        tl.to('#window-edit-body', {
            duration: 0,
            scrollTo: 0,
        })

        // Reset line visiblity
        for (let i = 0; i < lyrics.length; i++) {
            const line = lyrics[i]

            tl.call(() => {
                const linerootId = line.header
                    ? '.line-header-' + line.line
                    : '.line-' + line.line

                const el = root.current?.querySelector<HTMLDivElement>(
                    `${linerootId}`
                )
                if (!el) return
                el.style.visibility = 'hidden'
            })
        }

        let cursorRepeat = 1
        for (let i = 0; i < lyrics.length; i++) {
            const line = lyrics[i]

            const lineId = line.header
                ? `#text-header-${line.line}`
                : `#text-content-${line.line}`

            const cursorId = line.header
                ? `#cursor-header-${line.line}`
                : `#cursor-${line.line}`

            if (i >= 8)
                tl.to('#window-edit-body', {
                    duration: 0.2,
                    scrollTo: 40 * (i - 8),
                })

            tl.call(() => {
                const linerootId = line.header
                    ? '.line-header-' + line.line
                    : '.line-' + line.line

                const el = root.current?.querySelector<HTMLDivElement>(
                    `${linerootId}`
                )
                if (!el) return
                el.style.visibility = 'visible'
            })

            tl.add(
                WriteLine(cursorId, cursorRepeat, lineId, line.content),
                '>=0.1'
            )

            cursorRepeat = 0
        }

        return tl
    }

    useGSAP(
        () => {
            gsap.registerPlugin(TextPlugin)
            gsap.registerPlugin(ScrollToPlugin)
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 })

            tl.add(TypingLines())
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
                    <Layout.variant name="Japanese" />
                </>
            }
            body={
                <>
                    {lyrics.map((line, key) => {
                        return (
                            <Layout.line
                                key={key}
                                header={line.header}
                                line={line.line}
                                className={
                                    line.header
                                        ? 'invisible line-header-' + line.line
                                        : 'invisible line-' + line.line
                                }
                            >
                                <span
                                    id={
                                        line.header
                                            ? `text-header-${line.line}`
                                            : `text-content-${line.line}`
                                    }
                                ></span>
                                <TypingCursorIcon
                                    id={
                                        line.header
                                            ? `cursor-header-${line.line}`
                                            : `cursor-${line.line}`
                                    }
                                    className={`opacity-0`}
                                />
                            </Layout.line>
                        )
                    })}

                    <div className="h-96 w-full"></div>
                </>
            }
        />
    )
}
