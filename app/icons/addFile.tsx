export default function Icon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.5 7.875V9C16.5 12.5355 16.5 14.3033 15.4016 15.4016C14.3033 16.5 12.5355 16.5 9 16.5C5.46446 16.5 3.6967 16.5 2.59835 15.4016C1.5 14.3033 1.5 12.5355 1.5 9C1.5 5.46446 1.5 3.6967 2.59835 2.59835C3.6967 1.5 5.46446 1.5 9 1.5H10.125"
                strokeLinecap="round"
            />
            <path d="M5.25 10.5H12" strokeLinecap="round" />
            <path d="M5.25 13.125H9.75" strokeLinecap="round" />
            <path
                d="M14.625 0.72336L14.625 6.02665M11.9734 3.375L17.2767 3.37499"
                strokeLinecap="round"
            />
        </svg>
    )
}
