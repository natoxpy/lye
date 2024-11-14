export default function Icon(props: React.ComponentProps<'div'>) {
    return (
        <div
            style={{
                background: 'var(--color-txt-1)',
                width: '2px',
                height: '20px',
            }}
            {...props}
        ></div>
    )
}
