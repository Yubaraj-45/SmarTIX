import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CurtainRevealProps {
  children: React.ReactNode;
}

const CurtainReveal: React.FC<CurtainRevealProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const leftCurtainX = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const rightCurtainX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {children}

      {/* Left Curtain */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full z-20"
        style={{
          x: leftCurtainX,
          background: `
            repeating-linear-gradient(
              90deg,
              rgba(140, 0, 0, 1) 0px,
              rgba(190, 0, 0, 1) 10px,
              rgba(140, 0, 0, 1) 20px
            ),
            radial-gradient(circle at 30% 30%, rgba(255,0,0,0.4), transparent 60%)
          `,
          boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.6)',
          backgroundBlendMode: 'multiply',
        }}
      />

      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full z-20"
        style={{
          x: rightCurtainX,
          background: `
            repeating-linear-gradient(
              90deg,
              rgba(140, 0, 0, 1) 0px,
              rgba(190, 0, 0, 1) 10px,
              rgba(140, 0, 0, 1) 20px
            ),
            radial-gradient(circle at 70% 30%, rgba(255,0,0,0.4), transparent 60%)
          `,
          boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.6)',
          backgroundBlendMode: 'multiply',
        }}
      />
    </div>
  );
};

export default CurtainReveal;
