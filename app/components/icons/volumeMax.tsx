export default function Icon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.1168 4.09148C9.52167 4.38062 8.76742 4.87637 7.69258 5.58504L7.51013 5.70534C7.49625 5.7145 7.48254 5.72353 7.46902 5.73246C7.15219 5.94145 6.93276 6.08619 6.69231 6.19232C6.45534 6.29689 6.2063 6.37161 5.9509 6.41473C5.69174 6.4585 5.42887 6.45844 5.04932 6.45837C5.03312 6.45837 5.0167 6.45836 5.00007 6.45836C3.79701 6.45836 3.39093 6.47193 3.04567 6.63167C2.71204 6.78603 2.3567 7.12036 2.18233 7.44398C2.00043 7.78158 1.96704 8.12757 1.90283 9.18108C1.88521 9.47017 1.875 9.74733 1.875 10C1.875 10.2528 1.88521 10.5298 1.90283 10.819C1.96704 11.8725 2.00043 12.2185 2.18233 12.5561C2.3567 12.8797 2.71204 13.214 3.04567 13.3684C3.39093 13.5282 3.79701 13.5417 5.00007 13.5417C5.0167 13.5417 5.03311 13.5417 5.04931 13.5417C5.42887 13.5416 5.69174 13.5416 5.9509 13.5853C6.2063 13.6284 6.45534 13.7032 6.69231 13.8078C6.93276 13.9138 7.15219 14.0586 7.46902 14.2676C7.48254 14.2765 7.49624 14.2856 7.51013 14.2948L7.69258 14.415C8.76742 15.1237 9.52167 15.6194 10.1168 15.9086C10.7104 16.1969 11.0073 16.2085 11.2148 16.1376C11.3293 16.0986 11.4414 16.0415 11.5404 15.972C11.7209 15.8451 11.8855 15.5996 12.0013 14.9568C12.1175 14.3111 12.1603 13.4178 12.2196 12.1422C12.263 11.2092 12.2917 10.4265 12.2917 10C12.2917 9.57358 12.263 8.79083 12.2196 7.85788C12.1603 6.58226 12.1175 5.68898 12.0013 5.04323C11.8855 4.40043 11.7209 4.15496 11.5404 4.02808C11.4414 3.95853 11.3293 3.90151 11.2148 3.86243C11.0073 3.79158 10.7104 3.80313 10.1168 4.09148ZM9.57067 2.96712C10.259 2.63273 10.9368 2.44675 11.6186 2.67943C11.8452 2.75674 12.0633 2.86773 12.2591 3.00538C12.8475 3.41888 13.0966 4.07223 13.2315 4.82177C13.3642 5.55873 13.4095 6.53536 13.466 7.75193L13.4683 7.79986C13.5114 8.729 13.5417 9.54 13.5417 10C13.5417 10.46 13.5114 11.2711 13.4683 12.2002L13.466 12.2481C13.4095 13.4647 13.3642 14.4413 13.2315 15.1783C13.0966 15.9278 12.8475 16.5812 12.2591 16.9947C12.0633 17.1323 11.8452 17.2433 11.6186 17.3207C10.9368 17.5533 10.259 17.3673 9.57067 17.0329C8.89267 16.7036 8.07011 16.1612 7.04439 15.4849L6.82206 15.3382C6.4488 15.0922 6.3204 15.0099 6.18761 14.9513C6.04543 14.8886 5.896 14.8438 5.74277 14.8178C5.59963 14.7937 5.44717 14.7917 5.00007 14.7917C4.95474 14.7917 4.91003 14.7917 4.86589 14.7917C3.85179 14.7922 3.14716 14.7927 2.5208 14.5028C1.9418 14.235 1.38451 13.7106 1.0819 13.149C0.754719 12.5418 0.716327 11.9068 0.661739 11.0038C0.659574 10.9679 0.657384 10.9318 0.655149 10.8951C0.636444 10.5882 0.625 10.2847 0.625 10C0.625 9.71542 0.636444 9.41192 0.655149 9.105C0.657384 9.06833 0.659574 9.03208 0.661739 8.99625C0.716327 8.09333 0.754719 7.4583 1.0819 6.85107C1.38451 6.28943 1.9418 5.76508 2.5208 5.4972C3.14716 5.20741 3.85179 5.20778 4.86588 5.20832C4.91003 5.20833 4.95474 5.20836 5.00007 5.20836C5.44717 5.20836 5.59963 5.20635 5.74277 5.18218C5.896 5.15631 6.04543 5.11147 6.18761 5.04873C6.3204 4.99012 6.4488 4.90788 6.82206 4.66176L7.0444 4.51517C8.07012 3.83885 8.89267 3.29647 9.57067 2.96712ZM16.2666 4.52007C16.5318 4.29908 16.9258 4.33492 17.1468 4.60009L16.6667 5.0002C17.1468 4.60009 17.1468 4.60009 17.1468 4.60009L17.1478 4.60123L17.1488 4.60252L17.1513 4.60553L17.1576 4.61326C17.1623 4.61917 17.1682 4.62662 17.1752 4.6356C17.1891 4.65358 17.2072 4.67775 17.229 4.70822C17.2725 4.76917 17.3305 4.85533 17.3979 4.96771C17.5328 5.19255 17.7052 5.52186 17.875 5.96334C18.2152 6.84782 18.5417 8.1739 18.5417 10.0002C18.5417 11.8265 18.2152 13.1526 17.875 14.0371C17.7052 14.4786 17.5328 14.8078 17.3979 15.0327C17.3305 15.1451 17.2725 15.2313 17.229 15.2922C17.2072 15.3227 17.1891 15.3468 17.1752 15.3648C17.171 15.3702 17.1673 15.375 17.1638 15.3792C17.1616 15.3822 17.1595 15.3848 17.1576 15.3872L17.1513 15.3949L17.1488 15.3979L17.1478 15.3992C17.1478 15.3992 17.1468 15.4003 16.6667 15.0002L17.1468 15.4003C16.9258 15.6655 16.5318 15.7013 16.2666 15.4803C16.0027 15.2604 15.9659 14.8691 16.1833 14.6039M16.1833 14.6039C16.1833 14.6039 16.1848 14.602 16.1863 14.6002C16.1907 14.5945 16.1994 14.583 16.2118 14.5657C16.2366 14.5309 16.2762 14.4725 16.3261 14.3896C16.4255 14.2238 16.5657 13.9593 16.7083 13.5883C16.9932 12.8478 17.2917 11.6739 17.2917 10.0002C17.2917 8.32651 16.9932 7.15259 16.7083 6.41207C16.5657 6.04105 16.4255 5.7766 16.3261 5.61082C16.2762 5.52789 16.2366 5.46953 16.2118 5.43477C16.1994 5.41738 16.1907 5.40591 16.1863 5.4002C16.1848 5.39836 16.1833 5.39648 16.1833 5.39648L16.1863 5.4002L16.185 5.39843L16.1833 5.39648C15.9659 5.13136 16.0027 4.73998 16.2666 4.52007M14.6965 6.95386C14.9983 6.78623 15.3788 6.89493 15.5463 7.19668L15.023 7.48742C15.5463 7.19668 15.5463 7.19668 15.5463 7.19668L15.5469 7.19777L15.5476 7.19893L15.549 7.20147L15.5522 7.2074L15.5603 7.22269C15.5663 7.23442 15.5737 7.24922 15.5822 7.26714C15.5993 7.30299 15.6209 7.35132 15.6454 7.41262C15.6944 7.53525 15.7549 7.70937 15.8138 7.93872C15.9315 8.39783 16.0417 9.07508 16.0417 10.0002C16.0417 10.9253 15.9315 11.6026 15.8138 12.0617C15.7549 12.291 15.6944 12.4652 15.6454 12.5878C15.6209 12.6491 15.5993 12.6974 15.5822 12.7333C15.5737 12.7512 15.5663 12.766 15.5603 12.7778L15.5522 12.793L15.549 12.7989L15.5476 12.8015L15.5469 12.8027C15.5469 12.8027 15.5463 12.8038 15.023 12.513L15.5463 12.8038C15.3788 13.1055 14.9983 13.2142 14.6965 13.0466C14.3973 12.8803 14.2879 12.5048 14.4494 12.2044L14.4536 12.1958C14.4593 12.1838 14.4703 12.1599 14.4848 12.1236C14.5139 12.0509 14.5576 11.9281 14.6029 11.7513C14.6935 11.3978 14.7917 10.8251 14.7917 10.0002C14.7917 9.17533 14.6935 8.60258 14.6029 8.24918C14.5576 8.07229 14.5139 7.94953 14.4848 7.87685C14.4703 7.84048 14.4593 7.81655 14.4536 7.80456L14.4494 7.79603C14.2879 7.49554 14.3973 7.12007 14.6965 6.95386Z"
            />
        </svg>
    )
}