import { useGSAP } from '@gsap/react'
import Layout from './layout'
import { useRef } from 'react'
import gsap, { SteppedEase } from 'gsap'
import CursorIcon from '../assets/icons/cursor'
import TypingCursorIcon from '../assets/icons/typingCursor'
import { ScrollToPlugin, TextPlugin } from 'gsap/all'
import LyricsData from './lyrics-data.json'

export default function Window({
    nextAnimation,
}: {
    nextAnimation: () => void
}) {
    const root = useRef<HTMLDivElement>(null)
    const lyrics: { content: string; line: number; header?: boolean }[] =
        LyricsData[0]

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
            const tl = gsap.timeline({ repeat: 0, repeatDelay: 3 })

            tl.add(TypingLines())

            // Move to next animation
            tl.add(() => {
                setTimeout(() => nextAnimation())
                tl.kill()
            }, '>=3')
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
