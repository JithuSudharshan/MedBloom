import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

// Custom NProgress styles — injected once at module level
const NPROGRESS_STYLE = `
  #nprogress { pointer-events: none; }
  #nprogress .bar {
    background: linear-gradient(to right, #0d9488, #06b6d4, #0d9488);
    background-size: 200% 100%;
    animation: nprogress-shimmer 1.2s linear infinite;
    position: fixed;
    z-index: 1031;
    top: 0; left: 0;
    width: 100%; height: 3px;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.6), 0 0 5px rgba(6, 182, 212, 0.4);
  }
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px; width: 100px; height: 100%;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.8), 0 0 5px rgba(6, 182, 212, 0.6);
    opacity: 1;
    transform: rotate(3deg) translate(0px, -4px);
  }
  @keyframes nprogress-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
`;

NProgress.configure({
  minimum: 0.1,
  speed: 400,
  trickleSpeed: 120,
  showSpinner: false,
});

let styleInjected = false;

export default function NavigationProgress() {
  const location = useLocation();

  useEffect(() => {
    if (!styleInjected) {
      const style = document.createElement('style');
      style.textContent = NPROGRESS_STYLE;
      document.head.appendChild(style);
      styleInjected = true;
    }
  }, []);

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 300);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
}
