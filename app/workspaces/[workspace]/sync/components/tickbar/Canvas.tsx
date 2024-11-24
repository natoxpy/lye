import { Pixels } from '@/app/utils/units'
import React from 'react'

export const Canvas = React.forwardRef<HTMLCanvasElement, { height?: Pixels }>(
    (props, ref) => {
        return (
            <canvas
                className="bg-bg-4 w-full rendering-pixelated"
                height={props.height ?? 28}
                ref={ref}
            />
        )
    }
)

Canvas.displayName = 'Canvas'
