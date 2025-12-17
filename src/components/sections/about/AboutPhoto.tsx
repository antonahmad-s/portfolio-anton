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
    <article className="flex flex-col gap-3">
      <div
        className="font-mono text-[10px] text-ink border border-ink inline-block px-2 py-1 w-max uppercase tracking-wider"
        aria-label="Section label"
      >
        PERSONNEL_ID
      </div>

      <figure className="relative overflow-hidden border-2 border-ink group bg-gray-100 w-full max-w-[320px] h-[400px]">
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
              className="absolute inset-0 flex items-center justify-center bg-gray-200"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-ink border-t-transparent rounded-full"
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
              className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-ink"
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
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink pointer-events-none"
          aria-hidden="true"
        />

        {/* ID Badge - Wider with nowrap */}
        <figcaption
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-paper/95 backdrop-blur-sm px-6 py-2.5 border-2 border-ink shadow-[4px_4px_0px_rgba(0,0,0,0.8)] whitespace-nowrap"
          id="photo-caption"
        >
          <div className="font-bold font-serif text-base leading-none text-ink text-center">
            ANTON A. SUSILO
          </div>
          <div className="font-mono text-[9px] text-muted mt-1.5 tracking-wide text-center">
            QA-Engineer / AI Web Developer
          </div>
        </figcaption>
      </figure>

      {/* Download CV Button - Full width matching photo */}
      <motion.a
        href="/assets/cv/CV_Anton.pdf"
        download="CV_Anton_Ahmad_Susilo.pdf"
        className="w-full max-w-[320px] flex items-center justify-center gap-2 px-4 py-2.5 bg-ink text-paper font-mono text-xs font-bold uppercase tracking-wider border-2 border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        whileHover={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-ink-light)',
          boxShadow: '3px 3px 0px var(--color-ink-light)',
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
    </article>
  );
};
