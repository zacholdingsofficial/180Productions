import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideo({ videoUrl, onProgress, children }) {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef(null);
  const heroBoundaryRef = useRef(null); // This strictly measures the first screen

  // Preload video into RAM for zero-buffering playback on Vercel
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', videoUrl, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        if (onProgress) onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blobUrl = URL.createObjectURL(xhr.response);
        setVideoSrc(blobUrl);
      }
    };

    xhr.send();
    return () => xhr.abort();
  }, [videoUrl, onProgress]);

  // Handle Strict Hero-Only Playback and Tab Switching
  useEffect(() => {
    if (!videoSrc) return;

    const video = videoRef.current;
    
    // The video will ONLY play while the first 100vh (Hero Section) is visible
    const st = ScrollTrigger.create({
      trigger: heroBoundaryRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        video.play().catch(() => {});
        setShowControls(true);
      },
      onLeave: () => {
        video.pause();
        setShowControls(false); // Hide the button when scrolling past Hero
      },
      onEnterBack: () => {
        video.play().catch(() => {});
        setShowControls(true);
      },
      onLeaveBack: () => {
        video.pause();
        setShowControls(false);
      },
    });

    // Pause video when user switches browser tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (st.isActive) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      st.kill();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [videoSrc]);

  return (
    <div className="relative w-full z-0 bg-black">
      
      {/* Invisible boundary that strictly maps to the height of your Hero screen */}
      <div ref={heroBoundaryRef} className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-0" />
      
      {/* Sticky Video Background layer */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="sticky top-0 w-full h-screen bg-black flex items-center justify-center">
          {videoSrc && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="absolute w-[105%] h-[105%] object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
                autoPlay
                loop
                playsInline
                muted={isMuted} // Controlled by the aesthetic toggle
              />
              <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] bg-repeat" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </>
          )}
        </div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex flex-col pointer-events-none">
        {children}
      </div>

      {/* Aesthetic Audio Toggle - ONLY visible when showControls is true */}
      {videoSrc && showControls && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed bottom-8 right-8 z-[100] p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:border-white/40 hover:bg-black/40 transition-all duration-500 pointer-events-auto"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}