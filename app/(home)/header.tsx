import Link from 'next/link'
import Logo from '../components/icons/logo'

function Option({
    children,
    primary,
}: {
    children: React.ReactNode
    primary?: boolean
}) {
    return (
        <Link href="/workspaces">
            <div
                style={{
                    background: primary ? 'var(--color-accent-blue)' : '',
                    width: primary ? '138px' : '100px',
                    color: primary
                        ? 'var(--color-txt-2)'
                        : 'var(--color-txt-1)',
                }}
                className="cursor-pointer font-semibold flex items-center rounded-[6px] justify-center h-[49px]"
            >
                <span className="text-[16px]">{children}</span>
            </div>
        </Link>
    )
}

export default function Component() {
    return (
        <div className="flex items-center justify-between h-[100px] max-w-[1400px] px-[100px] w-full">
            <div>
                <Logo />
            </div>
            <div className="flex items-center gap-[10px] w-fit h-[80]">
                <Option>Pricing</Option>
                <Option>Blog</Option>
                <Option>Contact</Option>
                <Option primary>Get Started</Option>
            </div>
        </div>
    )
}
