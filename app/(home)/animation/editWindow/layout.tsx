import React, { forwardRef, ReactNode } from 'react'
// import AddFileIcon from '@/app/components/icons/addFile'
import FullFileIcon from '@/app/components/icons/fullFile'

type Props = {
    cursor: ReactNode
    navigation: ReactNode
    variantNavigation: ReactNode
    body: ReactNode
}

const Layout = forwardRef<HTMLDivElement, Props>((props, ref) => {
    return (
        <div
            style={{
                backgroundColor: 'hsla(207,21%,10%,.15)',
            }}
            className="flex w-full h-[calc(100%-60px)]"
            ref={ref}
        >
            <div className="absolute">{props.cursor}</div>

            <div
                style={{
                    background: 'hsla(206,16%,8%,.35)',
                }}
                className="flex w-fit h-full"
            >
                <div
                    style={{
                        background: 'hsla(210,17%,7%,.25)',
                    }}
                    className="w-[30px] h-full"
                >
                    {props.navigation}
                </div>
                {/* 
                <div className="w-[240px] h-full">
                    <div className="flex items-center justify-between w-full h-[30px] px-[20px]">
                        <span className="text-txt-2 text-[10px] opacity-75">
                            Variants
                        </span>
                        <AddFileIcon className="stroke-txt-1 w-[14px] h-[14px]" />
                    </div>
                    <div>{props.variantNavigation}</div>
                </div>
                {*/}
            </div>
            <div
                style={{
                    background: 'hsla(207,21%,10%,.15)',
                }}
                className="w-full h-full bg-red-400"
            >
                <div>{/*TOP nav*/}</div>
                <div className="overflow-y-hidden h-full" id="window-edit-body">
                    {props.body}
                </div>
                <div>{/*player*/}</div>
            </div>
        </div>
    )
})

Layout.displayName = 'layout'

function Line(props: {
    header?: boolean
    line: number
    children: ReactNode
    className?: React.ComponentProps<'div'>['className']
}) {
    return (
        <div className={(props.className ?? '') + ' flex w-full'}>
            <div className="flex opacity-75 text-txt-1 text-[14px] justify-end items-center px-[25px] w-[70px] h-[40px]">
                {props.header == undefined ? props.line : '~'}
            </div>
            <div
                style={{
                    color:
                        props.header == undefined
                            ? 'var(--color-txt-2)'
                            : 'var(--color-txt-1)',
                }}
                className="flex opacity-75 text-[16px] items-center w-full h-[40px]"
            >
                {props.children}
            </div>
        </div>
    )
}

const Variant = forwardRef<
    HTMLDivElement,
    { name: string; selected?: boolean }
>((props, ref) => {
    return (
        <div
            className="flex items-center w-full h-[40px] gap-[4px] pl-[20px]"
            ref={ref}
            style={{
                background: props.selected ? 'hsla(210,21%,10%,.15)' : '',
            }}
        >
            <FullFileIcon className="stroke-txt-1 w-[14px] opacity-75 h-[14px]" />
            <span className="text-txt-2 opacity-75 text-[10px]">
                {props.name}
            </span>
        </div>
    )
})
Variant.displayName = 'variant'

const Elements = {
    root: Layout,
    variant: Variant,
    line: Line,
}

export default Elements
