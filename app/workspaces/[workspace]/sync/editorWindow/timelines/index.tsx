import Body from './body'
import Options from './options'

export default function Component() {
    return (
        <div className="bg-bg-4 flex w-screen h-full min-h-[120px]">
            <Options />
            <Body />
        </div>
    )
}
