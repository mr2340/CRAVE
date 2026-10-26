import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
gsap.defaults({ ease: 'power2.out', duration: 0.5 });

export { gsap, ScrollTrigger, ScrollToPlugin, useGSAP };
