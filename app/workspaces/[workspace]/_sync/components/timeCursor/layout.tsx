import { Pixels } from '@/utils/units'
import { forwardRef } from 'react'

function IconCursor(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="100%"
            viewBox="0 0 10 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_2467_106561)">
                <path d="M1 0.5H5H9V4C9 4 6.5621 5.89259 5 7.44167C3.4379 5.89259 1 4 1 4V0.5Z" />
                <path
                    d="M5 0.5H1V4C1 4 3.4379 5.89259 5 7.44167M5 0.5C5 0.5 5 4.73078 5 7.44167M5 0.5H9V4C9 4 6.5621 5.89259 5 7.44167M5 119.5C5 119.5 5 51.2032 5 7.44167"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    )
}

export const Layout = forwardRef<HTMLDivElement, { height: Pixels }>(
    (props, ref) => {
        return (
            <div
                ref={ref}
                style={{
                    height: props.height + 'px',
                }}
                className="flex justify-center cursor-pointer group absolute z-20 w-[20px] invisible"
            >
                <IconCursor className="transition-all stroke-accent-1 fill-accent-1 group-hover:opacity-100 opacity-40" />
            </div>
        )
    }
)

Layout.displayName = 'layout'
