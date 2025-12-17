import React, { type ReactNode } from 'react';

interface AboutCardProps {
  label: string;
  number: string;
  title: string;
  titleItalic?: boolean;
  description: string;
  children: ReactNode;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  label,
  number,
  title,
  titleItalic = false,
  description,
  children,
}) => {
  return (
    <article className="flex flex-col h-full">
      <div
        className={`
          font-mono text-[10px] uppercase tracking-wider font-bold inline-block px-2 py-1 mb-4 w-max
          ${
            number === '01'
              ? 'text-accent bg-ink'
              : 'text-ink border border-ink'
          }
        `}
        aria-label={`Section ${number}`}
      >
        {number} {'//'} {label}
      </div>

      <h3
        className={`text-2xl md:text-3xl font-serif leading-tight mb-4 text-ink ${
          titleItalic ? 'italic' : ''
        }`}
      >
        {title}
      </h3>

      <p className="font-mono text-xs md:text-sm text-muted leading-relaxed mb-6">
        {description}
      </p>

      {children}
    </article>
  );
};
