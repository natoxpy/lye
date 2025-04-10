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
            <path d="M18 14V10V6" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="15" cy="19" r="3" strokeWidth="1.5" />
            <path
                d="M23 11C20.2386 11 18 8.76142 18 6"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M6.43797 3.9354L6.02087 3.5183C5.32981 2.82723 4.20937 2.82723 3.5183 3.5183C2.82723 4.20937 2.82723 5.32981 3.5183 6.02088L3.9354 6.43797M6.43797 3.9354C6.43797 3.9354 6.38583 4.82172 5.60378 5.60378C4.82172 6.38583 3.9354 6.43797 3.9354 6.43797M6.43797 3.9354L10.2725 7.76995C10.5323 8.02968 10.6621 8.15954 10.7738 8.30273C10.9055 8.47163 11.0185 8.65439 11.1106 8.84776C11.1888 9.01169 11.2468 9.18591 11.363 9.53437L11.7349 10.65M3.9354 6.43797L7.76995 10.2725C8.02968 10.5323 8.15954 10.6621 8.30273 10.7738C8.47163 10.9055 8.65439 11.0185 8.84776 11.1106C9.01169 11.1888 9.18591 11.2468 9.53437 11.363L10.65 11.7349M10.65 11.7349L11.3719 11.9755C11.5433 12.0327 11.7324 11.988 11.8602 11.8602C11.988 11.7324 12.0327 11.5433 11.9755 11.3719L11.7349 10.65M10.65 11.7349L11.7349 10.65"
                strokeWidth="1.5"
            />
            <path
                d="M5.5 21.5H4M5.5 21.5H7M5.5 21.5V19.5M2 16.5L3 15H3.5M9 16.5L8 15H5.5V17.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
