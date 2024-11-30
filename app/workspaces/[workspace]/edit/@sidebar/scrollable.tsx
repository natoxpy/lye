import Style from './scrollable.module.scss'
import DownArrowIcon from '@/app/components/icons/downArrow'
import { useEffect, useRef } from 'react'

export default function Scrollable({
    children,
    variant,
}: {
    variant: 'bg4' | 'bg3' | 'bg2'
    children: React.ReactNode
}) {
    const topShadowElement = useRef<HTMLDivElement>(null)
    const bottomShadowElement = useRef<HTMLDivElement>(null)
    const rootElement = useRef<HTMLDivElement>(null)

    const computeShadows = (
        el: HTMLDivElement,
        topShadow: HTMLDivElement,
        bottomShadow: HTMLDivElement
    ) => {
        const scrollHeight = el.scrollHeight
        const scrollTop = el.scrollTop
        const scrollBottom = el.scrollTop + el.getBoundingClientRect().height

        if (scrollTop < 20) topShadow.classList.add(Style.invisible)
        else topShadow.classList.remove(Style.invisible)

        if (scrollBottom > scrollHeight - 20)
            bottomShadow.classList.add(Style.invisible)
        else bottomShadow.classList.remove(Style.invisible)
    }

    useEffect(() => {
        const root = rootElement.current
        const topShadow = topShadowElement.current
        const bottomShadow = bottomShadowElement.current
        if (!root || !topShadow || !bottomShadow) return

        computeShadows(root, topShadow, bottomShadow)
    }, [topShadowElement, bottomShadowElement, rootElement])

    useEffect(() => {
        const root = rootElement.current
        const topShadow = topShadowElement.current
        const bottomShadow = bottomShadowElement.current
        if (!root || !topShadow || !bottomShadow) return

        computeShadows(root, topShadow, bottomShadow)
    })

    return (
        <div aria-label="Scrollable content" role="menu" className="relative ">
            <div
                role="banner"
                ref={topShadowElement}
                className={`pointer-events-none transition-all flex items-center justify-center absolute top-0 h-[20px] w-full ${
                    Style[variant + 'topScrollGradient']
                } ${Style.invisible}`}
            >
                <DownArrowIcon
                    role="img"
                    className="stroke-txt-1 rotate-180 w-[16px] h-[16px]"
                />
            </div>
            <div
                role="group"
                ref={rootElement}
                onLoadedMetadata={() => console.log('hello')}
                onScroll={(e) => {
                    const topShadow = topShadowElement.current
                    const bottomShadow = bottomShadowElement.current
                    if (!topShadow || !bottomShadow) return

                    computeShadows(
                        e.target as HTMLDivElement,
                        topShadow,
                        bottomShadow
                    )
                }}
                tabIndex={-1}
                className="flex max-h-[150px] overflow-y-auto flex-col no-scrollbar overscroll-none"
            >
                {children}
            </div>
            <div
                role="banner"
                ref={bottomShadowElement}
                className={`pointer-events-none transition-all flex items-center justify-center absolute bottom-0 h-[20px] w-full ${
                    Style[variant + 'bottomScrollGradient']
                } ${Style.invisible}`}
            >
                <DownArrowIcon
                    role="img"
                    className="stroke-txt-1 w-[16px] h-[16px]"
                />
            </div>
        </div>
    )
}
