'use client';

import React, { useRef, useState, useEffect } from 'react';

interface InspectorWrapperProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  id?: string;
}

const InspectorWrapper: React.FC<InspectorWrapperProps> = ({
  children,
  label,
  className = '',
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        w: Math.round(containerRef.current.offsetWidth),
        h: Math.round(containerRef.current.offsetHeight),
      });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Bounding Box Lines */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 border border-accent transition-opacity duration-150 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Corner Indicators */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-accent bg-paper"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-accent bg-paper"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-accent bg-paper"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-accent bg-paper"></div>

        {/* Measurement Label */}
        <div className="absolute -top-6 left-0 bg-accent text-ink text-[10px] font-mono px-1 py-0.5 leading-none whitespace-nowrap font-bold">
          {label ? `${label} :: ` : ''}W:{dimensions.w} H:{dimensions.h}
          {id && <span className="opacity-75 ml-1">#{id}</span>}
        </div>

        {/* Padding Visualizers */}
        <div className="absolute inset-0 bg-accent/5 mix-blend-multiply"></div>
      </div>
    </div>
  );
};

export default InspectorWrapper;
