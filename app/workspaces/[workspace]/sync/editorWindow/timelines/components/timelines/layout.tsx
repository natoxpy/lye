import { Pixels } from '@/app/utils/units'
import { forwardRef, ReactNode } from 'react'

export const Layout = forwardRef<HTMLDivElement, { children: ReactNode }>(
    (props, ref) => {
        return (
            <div
                className="grow min-w-full h-full no-scrollbar overflow-y-hidden overflow-x-auto overscroll-none border-t-[1px] border-bg-2"
                ref={ref}
            >
                {props.children}
            </div>
        )
    }
)

Layout.displayName = 'layout'

export const Board = forwardRef<
    HTMLDivElement,
    { width: Pixels; children: ReactNode }
>((props, ref) => {
    return (
        <div
            style={{
                width: props.width + 'px',
            }}
            className="grow py-[9px] min-w-full h-full no-scrollbar overflow-y-hidden overflow-x-auto overscroll-none border-t-[1px] border-bg-2"
            ref={ref}
        >
            {props.children}
        </div>
    )
})

Board.displayName = 'board'
