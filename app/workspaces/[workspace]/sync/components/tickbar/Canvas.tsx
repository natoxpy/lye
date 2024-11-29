import { Pixels } from '@/app/utils/units'
import React from 'react'

export const Canvas = React.forwardRef<HTMLCanvasElement, { height?: Pixels }>(
    (props, ref) => {
        return (
            <canvas
                style={{
                    height: (props.height ?? 28) + 'px',
                }}
                className="w-full rendering-pixelated"
                height={props.height ?? 28}
                ref={ref}
            />
        )
    }
)

Canvas.displayName = 'Canvas'
