import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';

export default function SectionHeading({
  eyebrow,
  title,
  dark = false,
  className = '',
}) {
  const headingRef = useRef(null);

  // M03: Section reveal ScrollTrigger animation
  useGSAP(
    () => {
      const el = headingRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          ok: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduce } = ctx.conditions;

          if (reduce) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: headingRef }
  );

  return (
    <div ref={headingRef} className={`section-heading ${className}`}>
      {eyebrow && (
        <p
          className={`text-[0.8125rem] font-semibold tracking-[0.08em] uppercase leading-tight mb-2 ${
            dark ? 'text-[var(--color-muted-on-dark)]' : 'text-[var(--color-ember-text)]'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(1.75rem,1.25rem+2.2vw,3rem)] ${
          dark ? 'text-[var(--color-canvas-on-dark)]' : 'text-[var(--color-ink)]'
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
