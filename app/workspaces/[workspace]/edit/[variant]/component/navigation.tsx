import FullFileIcon from '@/app/icons/fullFile'
import XIcon from '@/app/icons/x'

function Variant({ name, selected }: { name: string; selected?: boolean }) {
    return (
        <div
            style={{
                background: selected
                    ? 'var(--color-bg-4)'
                    : 'var(--color-bg-3)',
            }}
            className="group relative flex items-center justify-center w-fit h-full px-[15px]  gap-[10px]"
        >
            {selected && (
                <div className="w-full h-[2px] absolute top-0 bg-accent-1 opacity-50"></div>
            )}

            <FullFileIcon className="stroke-txt-2" />

            <span className="text-txt-2 text-[12px]">{name}</span>

            <XIcon
                style={{
                    stroke: selected ? 'var(--color-accent-1)' : '',
                }}
                className="group-hover:stroke-accent-1 opacity-75"
            />
        </div>
    )
}

export default function Component() {
    return (
        <div className="flex w-full min-h-[50px] bg-bg-2">
            <Variant name="Original (English)" selected />
            <Variant name="Japanese" />
            <Variant name="Chinese" />
        </div>
    )
}
