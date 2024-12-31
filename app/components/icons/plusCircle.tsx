export default function Icon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_2868_45690)">
                <path
                    d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39762 14.6024 1.66666 9.99999 1.66666C5.39762 1.66666 1.66666 5.39762 1.66666 10C1.66666 14.6024 5.39762 18.3333 9.99999 18.3333Z"
                    strokeWidth="1.5"
                />
                <path
                    d="M12.5 10H10M10 10H7.5M10 10V7.5M10 10V12.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_2868_45690">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
