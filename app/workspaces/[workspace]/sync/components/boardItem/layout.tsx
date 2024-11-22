import { ComponentProps, forwardRef } from 'react'

export const Layout = forwardRef<
    HTMLDivElement,
    { variant: 'main' } | ComponentProps<'div'>
>((props, ref) => {
    return (
        <div
            ref={ref}
            style={{
                height: 'calc(100%)',
            }}
            className="flex border-unaccent-accent-2 border-2 absolute cursor-pointer items-center justify-center bg-unaccent-accent-1 w-[100px] rounded-[5px]"
            {...props}
        />
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
