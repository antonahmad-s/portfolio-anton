'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AboutPhoto: React.FC = () => {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading');

  return (
    <article className="flex flex-col gap-3 pb-8 mb-8">
      {/* 👆 pb-8 + mb-8 = 64px total clearance untuk button */}

      <div
        className="font-mono text-[10px] border inline-block px-2 py-1 w-max uppercase tracking-wider"
        style={{
          color: 'var(--text-ink)',
          borderColor: 'var(--text-ink)',
        }}
        aria-label="Section label"
      >
        PERSONNEL_ID
      </div>

      <figure
        className="relative overflow-hidden group w-full max-w-[320px] h-[400px] border-2"
        style={{
          borderColor: 'var(--text-ink)',
          backgroundColor: 'var(--color-grid)',
        }}
      >
        <Image
          src="/assets/photos/Photo_Anton.webp"
          alt="Portrait of Anton Ahmad Susilo, Quality Assurance Architect"
          fill
          quality={85}
          priority
          className={`
            object-cover grayscale contrast-125
            group-hover:grayscale-0 group-hover:contrast-100
            transition-all duration-700
            ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 426px"
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />

        {/* Loading State */}
        <AnimatePresence>
          {imageStatus === 'loading' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-grid)' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-t-transparent rounded-full"
                style={{ borderColor: 'var(--text-ink)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {imageStatus === 'error' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                backgroundColor: 'var(--color-grid)',
                color: 'var(--text-ink)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={32} className="mb-2" />
              <p className="font-mono text-xs text-center px-4">
                Failed to load image
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner Markers */}
        <div
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 pointer-events-none"
          style={{ borderColor: 'var(--text-ink)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 pointer-events-none"
          style={{ borderColor: 'var(--text-ink)' }}
          aria-hidden="true"
        />

        {/* ID Badge */}
        <figcaption
          className="absolute bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-sm px-6 py-2.5 border-2 whitespace-nowrap"
          style={{
            backgroundColor: 'var(--bg-paper)',
            borderColor: 'var(--text-ink)',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
          }}
          id="photo-caption"
        >
          <div
            className="font-bold font-serif text-base leading-none text-center"
            style={{ color: 'var(--text-ink)' }}
          >
            ANTON A. SUSILO
          </div>
          <div
            className="font-mono text-[9px] mt-1.5 tracking-wide text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            QA-Engineer / AI Web Developer
          </div>
        </figcaption>
      </figure>

      {/* Download CV Button - WITH WRAPPER for overflow protection */}
      <div className="w-full max-w-[320px]">
        {/* 👆 Wrapper prevents parent overflow clipping */}
        <motion.a
          href="/assets/cv/CV_Anton.pdf"
          download="CV_Anton_Ahmad_Susilo.pdf"
          className="flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full"
          style={
            {
              backgroundColor: 'var(--text-ink)',
              color: 'var(--bg-paper)',
              borderColor: 'var(--text-ink)',
              '--tw-ring-color': 'var(--color-accent)',
              '--tw-ring-offset-color': 'var(--bg-paper)',
            } as React.CSSProperties
          }
          whileHover={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--text-ink)',
            boxShadow: '4px 4px 0px var(--text-ink)',
            y: -2,
            x: -2,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          aria-describedby="photo-caption"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Download size={14} />
          </motion.div>
          <span>Download CV</span>
        </motion.a>
      </div>
    </article>
  );
};
