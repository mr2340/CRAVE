/**
 * SectionWaveDivider
 * Fluid undulating organic wave divider matching the user's reference pattern.
 * Creates seamless organic transitions between sections.
 */
export default function SectionWaveDivider({
  fill = '#0B0B0B',
  flip = false,
  className = '',
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none block select-none pointer-events-none relative z-10 ${
        flip ? 'rotate-180 -mt-1' : '-mb-1'
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0,24 C180,68 360,-8 540,32 C720,72 900,-4 1080,38 C1240,76 1360,16 1440,36 L1440,84 L0,84 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
