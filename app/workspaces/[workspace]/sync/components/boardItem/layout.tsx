import { forwardRef, ReactNode } from 'react'

export const Layout = forwardRef<
    HTMLDivElement,
    { holding: boolean; children: ReactNode }
>((props, ref) => {
    return (
        <div
            ref={ref}
            style={{
                height: 'calc(100%)',
                borderColor: props.holding ? 'var(--color-accent-blue)' : '',
            }}
            className="flex overflow-hidden justify-between border-unaccent-accent-1 hover:border-accent-1 border-2 absolute cursor-pointer items-center bg-bg-4 w-[100px] rounded-[8px]"
        >
            {props.children}
        </div>
    )
})
Layout.displayName = 'layout'

export const Line = ({ number }: { number: number }) => {
    return (
        <span className="text-txt-2 select-none text-[16px] pointer-events-none">
            {number}
        </span>
    )
}

export const ResizeTip = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div
            ref={ref}
            className="w-[6px] cursor-ew-resize h-full bg-red-500"
        ></div>
    )
})

ResizeTip.displayName = 'resize'
