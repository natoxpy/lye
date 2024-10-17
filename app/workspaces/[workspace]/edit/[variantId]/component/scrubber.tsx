import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

export default function Scrubber({
    value,
    max,
    onChange,
}: {
    max: number
    value: number
    onChange: (value: number) => void
}) {
    // const dispatch = usePlayerDispatch()
    const root = useRef<HTMLDivElement>(null)
    const [mouseDown, setMouseDown] = useState(false)
    const [rootWidth, setRootWidth] = useState(0)

    const updateCurrentTime = useCallback(
        (e: MouseEvent, element: HTMLDivElement) => {
            const left = element.getBoundingClientRect().left
            const width = element.getBoundingClientRect().width
            let offset = e.clientX - left
            if (offset <= 0) offset = 0
            else if (offset >= width) offset = width

            const percent = offset / width
            onChange(percent * max)
        },
        [max, onChange]
    )

    useEffect(() => {
        const element = root.current
        if (element == null) return

        const onmousemove = (e: MouseEvent) => {
            if (mouseDown == false) return
            updateCurrentTime(e, element)
        }
        const onmouseup = () => setMouseDown(false)

        const resize = () => {
            setRootWidth(element.getBoundingClientRect().width)
        }

        resize()

        document.addEventListener('mousemove', onmousemove)

        window.addEventListener('mouseup', onmouseup)
        window.addEventListener('resize', resize)

        return () => {
            document.removeEventListener('mousemove', onmousemove)
            window.removeEventListener('mouseup', onmouseup)
            window.removeEventListener('resize', resize)
        }
    }, [root, mouseDown, max, updateCurrentTime])

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        const element = root.current
        if (element == null) return

        setMouseDown(true)
        updateCurrentTime(e as never as MouseEvent, element)
    }

    return (
        <div
            tabIndex={0}
            ref={root}
            className="group outline-none flex items-center w-full h-full min-w-[100px]"
            onMouseDown={onMouseDown}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="relative flex items-center w-full h-[3px] bg-bg-6 rounded-xl">
                <div
                    style={{
                        left: !Number.isNaN((value / max) * rootWidth)
                            ? (value / max) * rootWidth - 6 + 'px'
                            : '',
                        opacity: mouseDown ? '1' : '',
                    }}
                    className="cursor-pointer absolute left-[94px] origin-center group-hover:opacity-100 opacity-0 w-[12px] h-[12px] rounded-full bg-txt-2 z-10"
                ></div>

                <div className="w-full h-full overflow-hidden">
                    <div
                        style={{
                            backgroundColor: mouseDown
                                ? 'var(--color-accent-1)'
                                : '',
                            width: (value / max) * rootWidth + 'px',
                        }}
                        className="absolute rounded-lg h-full bg-txt-2 group-hover:bg-accent-1 group-focus-visible:bg-accent-1"
                    ></div>
                </div>
            </div>
        </div>
    )
}
