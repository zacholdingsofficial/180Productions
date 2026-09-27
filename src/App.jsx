import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollVideo from './components/ScrollVideo';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef(null);
  const mainRef = useRef(null);

  // Logo & Layout Refs
  const staticLogoRef = useRef(null);
  const logoLightRef = useRef(null); 
  const logoDarkRef = useRef(null);  
  const blackSectionRef = useRef(null);
  const footerRef = useRef(null);
  
  // Animation Refs
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const storyTriggerRef = useRef(null);
  const storyLinesRef = useRef([]);
  const serviceItemsRef = useRef([]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (loadProgress >= 100) {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [loadProgress]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05, smoothWheel: true });
    lenisRef.current = lenis;
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      isLoading ? lenisRef.current.stop() : lenisRef.current.start();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    let ctx = gsap.context(() => {
      // Logo Swap
      gsap.to(logoLightRef.current, {
        scrollTrigger: {
          trigger: blackSectionRef.current,
          start: "top 10%",
          end: "top top",
          scrub: true,
        },
        opacity: 0,
      });
      gsap.to(logoDarkRef.current, {
        scrollTrigger: {
          trigger: blackSectionRef.current,
          start: "top 10%",
          end: "top top",
          scrub: true,
        },
        opacity: 1,
      });

      // Hide logo when footer arrives
      gsap.to(staticLogoRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%", 
          end: "top 70%",
          scrub: true,
        },
        opacity: 0,
        pointerEvents: "none",
      });

      // Hero Text Parallax
      gsap.to(heroTextRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -150,
        opacity: 0,
        scale: 0.95,
      });

      // Story Reveal Animation
      storyLinesRef.current.forEach((line) => {
        gsap.fromTo(line, 
          { y: "100%", opacity: 0 },
          {
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              toggleActions: "play none none reverse", 
            },
            y: "0%",
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      });

      // Staggered Slide-In for Services
      serviceItemsRef.current.forEach((item, index) => {
        gsap.fromTo(item,
          { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
          {
            scrollTrigger: {
              trigger: item,
              start: "top 85%", 
              toggleActions: "play none none reverse",
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      });

    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

  const addToStoryLines = (el) => {
    if (el && !storyLinesRef.current.includes(el)) storyLinesRef.current.push(el);
  };
  const addToServices = (el) => {
    if (el && !serviceItemsRef.current.includes(el)) serviceItemsRef.current.push(el);
  };

  const coreServices = [
    { title: "Commercials", desc: "End-to-End Content Creation. High-converting promotional films for retail, startups, and modern corporate brands." },
    { title: "Lifestyle", desc: "Cinematic wedding films, high-energy vehicle reveals, and vibrant documentation of cultural milestones." },
    { title: "Institutional", desc: "Emotionally engaging farewell aftermovies, live stage coverage, and campus promotional films for student admissions." },
    { title: "Direction", desc: "Custom story writing, visual storyboarding, dialogue drafting, and on-screen creative consultation." }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Manrope'] selection:bg-red-700 selection:text-white overflow-hidden" ref={mainRef}>
      
      {/* Top-Left Logo Container */}
      <div ref={staticLogoRef} className="fixed top-6 left-6 md:top-10 md:left-10 z-50 pointer-events-auto">
        <a href="#top" onClick={(e) => { e.preventDefault(); lenisRef.current?.scrollTo(0); }} className="relative block w-12 h-12 md:w-20 md:h-20">
          <img ref={logoLightRef} src="/180productions.png" alt="180 Productions" className="absolute top-0 left-0 w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
          <img ref={logoDarkRef} src="/favcon.png" alt="180 Productions" className="absolute top-0 left-0 w-full h-full object-contain opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
        </a>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
          <div className="overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-['Oswald'] uppercase font-bold tracking-widest animate-pulse text-white/80">
              Initializing
            </h1>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* BLOCK 1: CONTINUOUS VIDEO BACKGROUND       */}
      {/* ========================================== */}
      <ScrollVideo videoUrl="/Required.mp4" onProgress={setLoadProgress}>
        
        <section ref={heroRef} className="h-screen flex flex-col items-center justify-center px-4 relative z-10" id="top">
          <div ref={heroTextRef} className="text-center flex flex-col items-center">
            <h1 className="text-[7rem] md:text-[14rem] leading-none font-['Oswald'] font-bold text-red-600 uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(220,38,38,0.5)]">
              180
            </h1>
            <h2 className="text-3xl md:text-6xl font-['Oswald'] font-light text-white tracking-[0.5em] uppercase mt-[-10px] md:mt-[-20px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
              Productions
            </h2>
          </div>
        </section>

        <section ref={storyTriggerRef} className="min-h-screen flex items-center justify-center px-6 md:px-24 py-16 relative z-10">
          <div className="max-w-6xl w-full text-center md:text-left flex flex-col gap-4 md:gap-6">
            <div className="overflow-hidden">
              <h2 ref={addToStoryLines} className="text-4xl md:text-[5.5rem] font-['Oswald'] font-bold uppercase tracking-tight leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.9)' }}>WE DON'T JUST </span>
                <span className="text-white/95">RECORD EVENTS.</span>
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 ref={addToStoryLines} className="text-4xl md:text-[5.5rem] font-['Oswald'] font-bold uppercase tracking-tight leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
                <span className="text-white/95">WE CRAFT </span>
                <span className="text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.9)]">VISUAL POWERHOUSES.</span>
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 ref={addToStoryLines} className="text-4xl md:text-[5.5rem] font-['Oswald'] font-bold uppercase tracking-tight leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.9)' }}>TRANSFORMING YOUR </span>
                <span className="text-white/95">CONCEPTS</span>
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 ref={addToStoryLines} className="text-4xl md:text-[5.5rem] font-['Oswald'] font-bold uppercase tracking-tight leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
                <span className="text-white/95">INTO </span>
                <span className="text-red-600 font-light italic tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.7)]">CINEMATIC REALITY.</span>
              </h2>
            </div>
          </div>
        </section>

      </ScrollVideo>

      {/* ========================================== */}
      {/* BLOCK 2: SOLID PURE BLACK SECTION          */}
      {/* ========================================== */}
      <div ref={blackSectionRef} className="relative z-20 w-full bg-black shadow-[0_-30px_50px_rgba(0,0,0,1)] pt-24 pointer-events-auto">
        
        <section className="pt-24 pb-12 px-6 md:px-12 pointer-events-none overflow-hidden">
            <div className="w-full max-w-7xl mx-auto relative">
              
              <div className="text-center mb-32 relative z-10">
                <h3 className="text-lg md:text-2xl font-mono text-red-600 tracking-[0.5em] uppercase">
                  Our Process
                </h3>
                <h2 className="text-6xl md:text-8xl font-['Bebas_Neue'] tracking-widest text-white mt-4 opacity-80">
                  CORE SERVICES
                </h2>
              </div>
              
              <div className="hidden md:block absolute left-1/2 top-48 bottom-0 w-[2px] bg-gradient-to-b from-red-600/0 via-red-600/50 to-red-600/0 -translate-x-1/2 z-0"></div>

              <div className="flex flex-col gap-32 relative z-10 pointer-events-auto">
                {coreServices.map((service, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div 
                      key={i} 
                      ref={addToServices} 
                      className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}
                    >
                      <div className={`w-full md:w-1/2 flex ${isEven ? 'justify-start md:justify-end' : 'justify-start md:justify-start'}`}>
                        <span 
                          className="text-[10rem] md:text-[14rem] font-['Bebas_Neue'] leading-none text-transparent transition-all duration-500 hover:scale-110 hover:text-white/5" 
                          style={{ WebkitTextStroke: '2px rgba(220,38,38,0.4)' }}
                        >
                          0{i + 1}
                        </span>
                      </div>

                      <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'items-start text-left' : 'items-start md:items-end text-left md:text-right'}`}>
                        <h4 className="text-5xl md:text-7xl font-['Bebas_Neue'] tracking-widest text-white mb-6 hover:text-red-500 transition-colors duration-300 cursor-default">
                          {service.title}
                        </h4>
                        <p className="text-xl md:text-2xl font-['Playfair_Display'] italic text-white/60 max-w-md leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ========================================== */}
              {/* GLASSMORPHISM CALL TO ACTION BUTTON        */}
              {/* ========================================== */}
              <div className="flex justify-center mt-32 mb-16 relative z-20 pointer-events-auto">
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); lenisRef.current?.scrollTo('#contact'); }}
                  className="group relative inline-flex items-center justify-center px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-red-600/50 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[600ms] ease-out group-hover:w-full"></div>
                  <span className="relative z-10 text-2xl md:text-3xl font-['Bebas_Neue'] tracking-[0.2em] text-white transition-colors duration-500">
                    KNOW MORE
                  </span>
                </a>
              </div>

            </div>
        </section>

        {/* ========================================== */}
        {/* BLOCK 3: DISTINCT WHITE FOOTER WITH ICONS  */}
        {/* ========================================== */}
        <footer id="contact" ref={footerRef} className="px-6 md:px-24 pt-32 pb-12 bg-white text-black transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20 max-w-7xl mx-auto">
            
            <div className="max-w-md">
              <img src="/180productions.png" alt="180 Productions Logo" className="w-24 mb-6 drop-shadow-sm" />
              <h4 className="text-black font-['Bebas_Neue'] text-4xl tracking-widest mb-3">180 PRODUCTIONS</h4>
              <p className="text-zinc-600 font-light text-sm leading-relaxed">
                A full-service creative video production and content development agency. Transforming concepts, moments, and brand stories into high-impact cinematic visuals.
              </p>
            </div>

            <div className="text-left md:text-right font-mono text-xs text-zinc-600 tracking-widest leading-loose flex flex-col md:items-end">
              <p className="text-black mb-4 font-bold tracking-[0.2em] uppercase">Contact Info</p>
              
              {/* Authentic Brand Social Icons */}
              <div className="flex items-center gap-5 mb-5">
                {/* Instagram Icon */}
                <a href="#" target="_blank" rel="noreferrer" className="text-zinc-800 hover:text-[#E1306C] transition-colors duration-300">
                  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* WhatsApp Icon */}
                <a href="#" target="_blank" rel="noreferrer" className="text-zinc-800 hover:text-[#25D366] transition-colors duration-300">
                  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>

              <p>Services Anywhere in India 📍</p>
              <p>Kerala, India</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-zinc-200 pt-8 relative gap-6 md:gap-0">
              
              <div className="flex md:hidden items-center justify-center gap-4 mb-2">
                <span className="text-red-600 font-black text-xs tracking-widest font-mono animate-pulse">A ZAC PRODUCT</span>
                <span className="text-zinc-300">|</span>
                <a href="https://wa.me/917558957246" target="_blank" rel="noreferrer" className="text-black hover:text-red-600 transition-colors italic font-serif text-base font-bold">R.</a>
              </div>

              <p className="text-zinc-500 text-[10px] tracking-widest font-mono text-center md:text-left order-last md:order-first">
                © {new Date().getFullYear()} 180 Productions. All rights reserved.
              </p>

              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                <span className="text-red-600 font-black text-sm tracking-[0.5em] font-mono animate-pulse drop-shadow-sm">
                  A ZAC PRODUCT
                </span>
              </div>

              <a href="https://wa.me/917558957246" target="_blank" rel="noreferrer" className="hidden md:block text-black hover:text-red-600 transition-colors italic font-serif text-xl font-bold">
                R.
              </a>
          </div>
        </footer>
      </div>

    </div>
  );
}