import { gsap } from './gsap.js';

/**
 * Executes a parabolic fly-to-cart animation from a source element to a target element.
 * @param {object} options
 * @param {HTMLElement} options.startEl - Element where clone spawns (e.g. hero image or button)
 * @param {HTMLElement} options.targetEl - Element where clone lands (e.g. cart pill or badge)
 * @param {string} options.imageSrc - URL of image to animate
 * @param {() => void} [options.onComplete] - Callback when fly animation finishes
 */
export function flyToCart({ startEl, targetEl, imageSrc, onComplete }) {
  if (typeof document === 'undefined') return;

  const startRect = startEl?.getBoundingClientRect() || {
    left: window.innerWidth / 2 - 40,
    top: window.innerHeight / 3,
    width: 80,
    height: 80,
  };

  const targetRect = targetEl?.getBoundingClientRect() || {
    left: window.innerWidth / 2,
    top: window.innerHeight - 80,
    width: 40,
    height: 40,
  };

  // Create ghost image element
  const ghost = document.createElement('img');
  ghost.src = imageSrc;
  ghost.alt = 'Flying item';
  ghost.className = 'fly-to-cart-ghost';
  ghost.style.position = 'fixed';
  ghost.style.left = `${startRect.left}px`;
  ghost.style.top = `${startRect.top}px`;
  ghost.style.width = `${startRect.width}px`;
  ghost.style.height = `${startRect.height}px`;
  ghost.style.objectFit = 'contain';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '99999';
  ghost.style.borderRadius = '50%';
  ghost.style.transformOrigin = 'center center';
  ghost.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))';

  document.body.appendChild(ghost);

  const deltaX = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
  const deltaY = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);

  // Parabolic motion: horizontal moves linearly/smoothly while vertical accelerates down (gravity)
  const tl = gsap.timeline({
    onComplete: () => {
      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
      if (typeof onComplete === 'function') {
        onComplete();
      }
    },
  });

  // Scale down to 24% as specified
  tl.to(
    ghost,
    {
      x: deltaX,
      duration: 0.45,
      ease: 'power1.inOut',
    },
    0
  );

  tl.to(
    ghost,
    {
      y: deltaY,
      duration: 0.45,
      ease: 'power2.in',
    },
    0
  );

  tl.to(
    ghost,
    {
      scale: 0.24,
      opacity: 0.85,
      duration: 0.45,
      ease: 'power1.out',
    },
    0
  );
}
