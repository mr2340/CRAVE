import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Flip);
gsap.defaults({ ease: 'power2.out', duration: 0.5 });

export { gsap, ScrollTrigger, ScrollToPlugin, Flip, useGSAP };
