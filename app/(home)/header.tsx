import Link from 'next/link'
import Logo from '../components/icons/logo'
import { HTMLAttributeAnchorTarget } from 'react'

function Option({
    children,
    primary,
    href,
    target,
}: {
    href: string
    children: React.ReactNode
    primary?: boolean
    target?: HTMLAttributeAnchorTarget
}) {
    return (
        <Link href={href} target={target}>
            <div
                style={{
                    background: primary ? 'var(--color-accent-blue)' : '',
                    width: primary ? '138px' : '100px',
                    color: primary
                        ? 'var(--color-txt-2)'
                        : 'var(--color-txt-1)',
                }}
                className="cursor-pointer relative font-semibold flex items-center rounded-[6px] justify-center h-[49px]"
            >
                <span className="text-[16px]">{children}</span>
            </div>
        </Link>
    )
}

export default function Component() {
    return (
        <div className="flex items-center justify-between h-[100px] max-w-[1400px] px-[100px] w-full">
            <div className="w-20 h-20">
                <Logo />
            </div>
            <div className="flex relative items-center gap-[10px] w-fit h-[80]">
                <Option
                    target={'_blank'}
                    href={'https://github.com/natoxpy/lye'}
                >
                    Github
                </Option>
                <Option primary href={'/workspaces'}>
                    Get Started
                    <span className="absolute whitespace-nowrap text-txt-3 -right-16">
                        v0.2.0
                    </span>
                </Option>
            </div>
        </div>
    )
}
