import { useEffect, useRef } from 'react';

/**
 * Smoothly scrolls the window to targetY using a custom ease-in-out quartic curve
 * providing a gentle, velvety magnetic damping feel instead of the browser's abrupt 300ms snap.
 */
function animateScrollTo(targetY, duration = 950, onComplete) {
  if (typeof window === 'undefined') {
    if (onComplete) onComplete();
    return () => {};
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) {
    if (onComplete) onComplete();
    return () => {};
  }

  const startTime = performance.now();
  let animationFrameId = null;
  let isCancelled = false;

  // Gentle magnetic easing: easeInOutQuart gives a cushioned start and a damped finish
  const easeInOutQuart = (t) => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  const step = (currentTime) => {
    if (isCancelled) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutQuart(progress);

    window.scrollTo(0, Math.round(startY + distance * easeProgress));

    if (progress < 1) {
      if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameId = requestAnimationFrame(step);
      }
    } else {
      if (onComplete) onComplete();
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    animationFrameId = requestAnimationFrame(step);
  } else {
    window.scrollTo(0, targetY);
    if (onComplete) onComplete();
  }

  return () => {
    isCancelled = true;
    if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

/**
 * Custom hook providing a smooth magnetic scroll effect between the Hero section
 * and the Feed section.
 *
 * It pulls the user into the Feed section when scrolling down from Hero,
 * and snaps back to Hero when scrolling up from the top of the Feed.
 * Scrolling inside the Feed section itself remains 100% free and unrestricted.
 */
export function useMagneticScroll({
  feedRef,
  enabled = true,
  navbarHeight = 64,
}) {
  const isSnappingRef = useRef(false);
  const cancelAnimationRef = useRef(null);
  const touchStartYRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Honor prefers-reduced-motion accessibility setting
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) return;

    const getFeedTop = () => {
      const feedEl = feedRef.current;
      if (!feedEl) return null;
      const rect = feedEl.getBoundingClientRect();
      return Math.max(0, Math.round(rect.top + window.scrollY - navbarHeight));
    };

    const snapTo = (targetY) => {
      if (isSnappingRef.current) return;
      isSnappingRef.current = true;

      if (cancelAnimationRef.current) {
        cancelAnimationRef.current();
      }

      // Smooth 950ms ease-in-out quartic animation with magnetic damping
      cancelAnimationRef.current = animateScrollTo(targetY, 950, () => {
        isSnappingRef.current = false;
        cancelAnimationRef.current = null;
      });
    };

    // 1. Wheel event handler (Mouse wheel & Trackpad)
    const handleWheel = (e) => {
      if (isSnappingRef.current) {
        // Prevent scroll stutter during active snapping transition
        e.preventDefault();
        return;
      }

      const feedTop = getFeedTop();
      if (feedTop === null || feedTop <= 0) return;

      const currentY = window.scrollY;
      const deltaY = e.deltaY;

      // Ignore small or accidental trackpad/mouse-wheel movements
      if (Math.abs(deltaY) < 30) return;

      // Magnetic pull DOWN: in Hero zone, pulling smoothly towards Feed
      if (deltaY > 0 && currentY < feedTop - 40) {
        e.preventDefault();
        snapTo(feedTop);
        return;
      }

      // Magnetic pull UP: at or very near top of Feed, pulling back to Hero
      if (deltaY < 0 && currentY <= feedTop + 40 && currentY > 15) {
        e.preventDefault();
        snapTo(0);
        return;
      }
    };

    // 2. Touch event handlers (Mobile / Tablet swipe)
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (touchStartYRef.current === null || isSnappingRef.current) return;
      const touchEndY = e.changedTouches[0]?.clientY;
      if (touchEndY === undefined) return;

      const deltaY = touchStartYRef.current - touchEndY; // > 0 means swiped up -> scroll down
      touchStartYRef.current = null;

      if (Math.abs(deltaY) < 50) return; // requiring an intentional swipe gesture

      const feedTop = getFeedTop();
      if (feedTop === null || feedTop <= 0) return;

      const currentY = window.scrollY;

      if (deltaY > 0 && currentY < feedTop - 40) {
        snapTo(feedTop);
      } else if (deltaY < 0 && currentY <= feedTop + 40 && currentY > 15) {
        snapTo(0);
      }
    };

    // 3. Keyboard handlers (ArrowDown / PageDown / Space / ArrowUp)
    const handleKeyDown = (e) => {
      if (isSnappingRef.current) return;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const feedTop = getFeedTop();
      if (feedTop === null || feedTop <= 0) return;

      const currentY = window.scrollY;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey) {
        if (currentY < feedTop - 40) {
          e.preventDefault();
          snapTo(feedTop);
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) {
        if (currentY <= feedTop + 40 && currentY > 15) {
          e.preventDefault();
          snapTo(0);
        }
      }
    };

    // 4. Dead-zone correction: if scrollbar was dragged and released in between sections
    const handleScroll = () => {
      if (isSnappingRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (isSnappingRef.current) return;
        const feedTop = getFeedTop();
        if (feedTop === null || feedTop <= 0) return;

        const currentY = window.scrollY;
        // If stranded in the middle zone (Logo loop or gradient bridge)
        if (currentY > 80 && currentY < feedTop - 60) {
          if (currentY < feedTop * 0.45) {
            snapTo(0);
          } else {
            snapTo(feedTop);
          }
        }
      }, 150);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (cancelAnimationRef.current) cancelAnimationRef.current();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, navbarHeight, feedRef]);
}
