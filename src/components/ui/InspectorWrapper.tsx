'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InspectorWrapperProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  id?: string;
}

/**
 * Inspector Wrapper Component
 *
 * Adds developer-style labels and bounding boxes to UI elements
 * Only visible in development mode
 *
 * @performance Removes itself in production builds
 */
const InspectorWrapper: React.FC<InspectorWrapperProps> = ({
  children,
  label,
  className = '',
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        w: Math.round(containerRef.current.offsetWidth),
        h: Math.round(containerRef.current.offsetHeight),
      });
    }
  }, [children]);

  // Skip inspector UI in production
  if (!isDev) {
    return <>{children}</>;
  }

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
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="absolute -top-6 left-0 bg-accent text-ink text-[10px] font-mono px-1 py-0.5 leading-none whitespace-nowrap font-bold flex items-center gap-1 pointer-events-auto cursor-pointer hover:bg-accent/90 transition-colors"
          aria-label={`Inspector: ${label || 'Component'}`}
          type="button"
        >
          <Info size={10} aria-hidden="true" />
          {label ? `${label} :: ` : ''}W:{dimensions.w} H:{dimensions.h}
          {id && <span className="opacity-75 ml-1">#{id}</span>}
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-24 left-0 bg-ink text-paper p-3 font-mono text-[10px] z-50 border border-accent min-w-[180px] pointer-events-auto">
            <div className="space-y-1.5">
              {label && (
                <div>
                  <span className="text-accent">Label:</span> {label}
                </div>
              )}
              {id && (
                <div>
                  <span className="text-accent">ID:</span> {id}
                </div>
              )}
              <div>
                <span className="text-accent">Size:</span> {dimensions.w}×
                {dimensions.h}px
              </div>
              <div>
                <span className="text-accent">Type:</span> {typeof children}
              </div>
            </div>
          </div>
        )}

        {/* Padding Visualizers */}
        <div className="absolute inset-0 bg-accent/5 mix-blend-multiply"></div>
      </div>
    </div>
  );
};

export default InspectorWrapper;
