import { Pixels } from '@/app/utils/units'
import React from 'react'

export const Layout = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode }
>((props, ref) => {
    return (
        <div className="w-full" ref={ref}>
            {props.children}
        </div>
    )
})

Layout.displayName = 'layout'

export const Canvas = React.forwardRef<HTMLCanvasElement, { height?: Pixels }>(
    (props, ref) => {
        return (
            <canvas
                className="bg-bg-4 rendering-pixelated"
                height={props.height ?? 28}
                ref={ref}
            />
        )
    }
)

Canvas.displayName = 'canvas'
