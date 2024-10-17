export default function Icon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15 16L10.5 16M4 16H7.5"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path d="M12 19H6" strokeWidth="1.5" strokeLinecap="round" />
            <path
                d="M15.5 13L13.5 13M4 13L10.5 13"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M19 4L17 4M5 4L14 4"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M10.5 7V9.5M13 7V9.5L20 9.5V7L15.5 7M4 7L4 9.5H8V7L4 7Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22 15.3636C20.3431 15.3636 18.5 13.9853 18.5 11.5V17M18.5 20.75C18.5 21.9926 17.4926 23 16.25 23C15.0074 23 14 21.9926 14 20.75C14 19.5074 15.0074 18.5 16.25 18.5C17.4926 18.5 18.5 19.5074 18.5 20.75Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
