import { useState, useCallback, useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export const useSmoothScroll = (totalSections: number) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateToSection = useCallback((sectionIndex: number) => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    setIsScrolling(true);
    setCurrentSection(sectionIndex);

    const targetPosition = sectionIndex * container.clientHeight;
    const startPosition = container.scrollTop;
    const distance = targetPosition - startPosition;
    
    animate(0, 1, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (progress) => {
        const easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        container.scrollTop = startPosition + distance * easeProgress;
      },
      onComplete: () => {
        setIsScrolling(false);
      }
    });
  }, [isScrolling]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      
      wheelTimeoutRef.current = setTimeout(() => {
        const delta = e.deltaY;
        const threshold = 50;
        
        if (Math.abs(delta) > threshold) {
          if (delta > 0 && currentSection < totalSections - 1) {
            navigateToSection(currentSection + 1);
          } else if (delta < 0 && currentSection > 0) {
            navigateToSection(currentSection - 1);
          }
        }
      }, 50);
    };

    const handleScroll = () => {
      if (isScrolling) return;
      
      if (scrollTimeoutRef.current !== null) {
          clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollPosition = container.scrollTop;
        const sectionHeight = container.clientHeight;
        const newSection = Math.round(scrollPosition / sectionHeight);
        
        if (newSection !== currentSection && !isScrolling) {
          setCurrentSection(newSection);
        }
      }, 100);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSection, navigateToSection, isScrolling, totalSections]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
        e.preventDefault();
        navigateToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        e.preventDefault();
        navigateToSection(currentSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, totalSections, navigateToSection, isScrolling]);

  return {
    currentSection,
    isScrolling,
    containerRef,
    navigateToSection
  };
};