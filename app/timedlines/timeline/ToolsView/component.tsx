import { Slider } from '@mantine/core'

export default function Component({ setZoomSize }: { setZoomSize: (value: number) => void }) {
    return (
        <div className="flex justifycenter w-full h-6">
            <div className="flex w-96 h-6 grow-[1]">
                <div className="flex items-center">
                    <div className="w-44">
                        <Slider
                            onChange={setZoomSize}
                            defaultValue={1}
                            min={0.15}
                            step={0.01}
                            max={3}
                            size="xs"
                            label={null}
                            color="grey"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-72 h-6 grow-[1]"></div>
        </div>
    )
}
