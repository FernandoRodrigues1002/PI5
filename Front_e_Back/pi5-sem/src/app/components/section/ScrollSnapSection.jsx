"use client";

import { useEffect, useRef } from "react";

const ScrollSnapSection = ({ children, className = "" }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Função para detectar quando a seção está no viewport
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Verifica se a seção está visível
      const isVisible = rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5;
      
      if (isVisible) {
        section.classList.add('section-active');
      } else {
        section.classList.remove('section-active');
      }
    };

    // Adiciona o listener de scroll com throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Chama uma vez para verificar o estado inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`scroll-snap-section ${className}`}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </section>
  );
};

export default ScrollSnapSection;