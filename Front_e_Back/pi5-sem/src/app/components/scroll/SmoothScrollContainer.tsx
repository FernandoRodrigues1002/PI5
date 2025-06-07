import React from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

interface SmoothScrollContainerProps {
  children: React.ReactNode;
  totalSections: number;
  showNavigation?: boolean; // Você pode remover essa prop se não for mais usá-la
}

const SmoothScrollContainer: React.FC<SmoothScrollContainerProps> = ({ children, totalSections }) => {
  const { containerRef } = useSmoothScroll(totalSections);

  return (
    <div className="relative">
      {/* Container principal com scroll padrão */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto overscroll-none"
        style={{ scrollBehavior: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollContainer;
