import { useState, useCallback, useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export const useSmoothScroll = (totalSections: number) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionHeightsRef = useRef<number[]>([]);
  const isNavigatingRef = useRef(false); // Flag para controlar navegação programática

  // Função para calcular alturas das seções em vh
  const calculateSectionHeights = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('[data-section]');
    sectionHeightsRef.current = Array.from(sections).map(section => {
      const height = (section as HTMLElement).offsetHeight;
      return height / window.innerHeight; // Altura em vh
    });
  }, []);

  const navigateToSection = useCallback((sectionIndex: number) => {
    const container = containerRef.current;
    if (!container || isScrolling || isNavigatingRef.current) return;

    const sections = container.querySelectorAll('[data-section]');
    const targetSection = sections[sectionIndex] as HTMLElement;
    if (!targetSection) return;

    isNavigatingRef.current = true;
    setIsScrolling(true);
    setCurrentSection(sectionIndex);

    const targetPosition = targetSection.offsetTop;
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
        isNavigatingRef.current = false;
      }
    });
  }, [isScrolling]);

  // Função melhorada para detectar seção atual
  const getCurrentSection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;

    const sections = container.querySelectorAll('[data-section]');
    const scrollPosition = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollCenter = scrollPosition + containerHeight / 2;

    let bestSection = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const sectionElement = sections[i] as HTMLElement;
      const sectionTop = sectionElement.offsetTop;
      const sectionHeight = sectionElement.offsetHeight;
      const sectionCenter = sectionTop + sectionHeight / 2;
      
      // Calcula a distância do centro da viewport ao centro da seção
      const distance = Math.abs(scrollCenter - sectionCenter);
      
      // Se a seção está pelo menos 30% visível e é a mais próxima do centro
      const visibleTop = Math.max(scrollPosition, sectionTop);
      const visibleBottom = Math.min(scrollPosition + containerHeight, sectionTop + sectionHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / Math.min(containerHeight, sectionHeight);
      
      if (visibilityRatio >= 0.3 && distance < bestDistance) {
        bestDistance = distance;
        bestSection = i;
      }
    }

    return bestSection;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calcular alturas iniciais
    calculateSectionHeights();
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || isNavigatingRef.current) {
        e.preventDefault();
        return;
      }

      const currentSectionHeight = sectionHeightsRef.current[currentSection];
      
      // Se a seção atual é maior que 100vh, permite scroll livre
      if (currentSectionHeight > 1) {
        const sections = container.querySelectorAll('[data-section]');
        const sectionElement = sections[currentSection] as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionBottom = sectionTop + sectionElement.offsetHeight;
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        
        // Verifica se está exatamente no limite da seção
        const atTop = scrollTop <= sectionTop + 10; // Pequena margem de tolerância
        const atBottom = scrollTop + containerHeight >= sectionBottom - 10;
        
        if (e.deltaY > 0 && atBottom && currentSection < totalSections - 1) {
          e.preventDefault();
          navigateToSection(currentSection + 1);
          return;
        } else if (e.deltaY < 0 && atTop && currentSection > 0) {
          e.preventDefault();
          navigateToSection(currentSection - 1);
          return;
        }
        
        // Permite scroll normal dentro da seção
        return;
      }

      // Para seções de 100vh ou menos, usa scroll por seções
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
      if (isScrolling || isNavigatingRef.current) return;
      
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        const newSection = getCurrentSection();
        
        if (newSection !== currentSection) {
          setCurrentSection(newSection);
        }
      }, 150); // Aumentado o debounce para evitar mudanças muito rápidas
    };

    const handleResize = () => {
      calculateSectionHeights();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSection, navigateToSection, isScrolling, totalSections, calculateSectionHeights, getCurrentSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || isNavigatingRef.current) return;
      
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