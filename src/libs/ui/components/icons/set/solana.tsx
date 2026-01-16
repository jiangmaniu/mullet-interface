import { SvgIconProps } from '../svg-icon'

export const IconSolana = ({ width, height, viewBox, ...props }: SvgIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width ?? 24} height={height ?? 24} viewBox="0 0 24 24" fill="none" {...props}>
      <mask id="mask0_421_2429" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <path d="M24 0H0V24H24V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_421_2429)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill="black"
        />
        <path
          d="M7.94981 14.6784C8.02223 14.606 8.1218 14.5637 8.22741 14.5637H17.8045C17.9795 14.5637 18.067 14.7749 17.9433 14.8986L16.0514 16.7905C15.979 16.8629 15.8794 16.9052 15.7738 16.9052H6.19674C6.02173 16.9052 5.93423 16.694 6.05794 16.5703L7.94981 14.6784Z"
          fill="url(#paint0_linear_421_2429)"
        />
        <path
          d="M7.94981 7.61466C8.02525 7.54224 8.12482 7.5 8.22741 7.5H17.8045C17.9795 7.5 18.067 7.71121 17.9433 7.83493L16.0514 9.7268C15.979 9.79922 15.8794 9.84146 15.7738 9.84146H6.19674C6.02173 9.84146 5.93423 9.63025 6.05794 9.50654L7.94981 7.61466Z"
          fill="url(#paint1_linear_421_2429)"
        />
        <path
          d="M16.0514 11.1239C15.979 11.0515 15.8794 11.0093 15.7738 11.0093H6.19674C6.02173 11.0093 5.93423 11.2205 6.05794 11.3442L7.94981 13.2361C8.02223 13.3085 8.1218 13.3507 8.22741 13.3507H17.8045C17.9795 13.3507 18.067 13.1395 17.9433 13.0158L16.0514 11.1239Z"
          fill="url(#paint2_linear_421_2429)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_421_2429" x1="16.8896" y1="6.36997" x2="10.2615" y2="19.0654" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="paint1_linear_421_2429" x1="13.9914" y1="4.85676" x2="7.36333" y2="17.5522" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="paint2_linear_421_2429" x1="15.4313" y1="5.60857" x2="8.8032" y2="18.304" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
