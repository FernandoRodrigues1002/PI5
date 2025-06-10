import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  sectionIndex?: number; // Novo prop para identificar a seção
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  id,
  sectionIndex,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <motion.section
      ref={ref}
      id={id}
      data-section={sectionIndex} // Adiciona o atributo data-section
      initial={{ opacity: 0, y: 5 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`w-full relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;