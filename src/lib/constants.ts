import { Project, MenuItem } from '@/types';

/* ========================================
   THREE.JS SHADER COLORS
   ======================================== */
export const COLORS = {
  acid: '#d4ff00', // Highlighter Yellow - matches CSS accent
  grid: '#0a0a0a', // Deep Void Black - matches paper-dark
  phosphor: '#e0e0e0', // Off-White Phosphor - matches ink-dark
  neonGreen: '#00ff66', // Neon Green for peaks
} as const;

/* ========================================
   CONTACT INFORMATION
   ======================================== */
export const CONTACT = {
  email: 'antonahmadsusilo@gmail.com',
  github: 'https://github.com/antonahmad-s',
  linkedin: 'https://linkedin.com/in/antonahmads',
  whatsapp: 'https://wa.me/6285817578830',
} as const;

export const MENU_ITEMS: MenuItem[] = [
  { label: 'System Overview', id: 'hero', index: 1 },
  { label: 'Identity Core', id: 'about', index: 2 },
  { label: 'Execution Logs', id: 'experience', index: 3 },
  { label: 'Inventory', id: 'skills', index: 4 },
  { label: 'Portfolio', id: 'portfolio', index: 5 },
];

export const PROJECTS: Project[] = [
  {
    id: 'TRACKWISE',
    title: 'TrackWISE',
    category: 'Bug Tracking System',
    status: 'VERIFIED',
    description:
      'Developed a robust bug management platform featuring real-time notification pipelines (Email & Telegram) to accelerate incident response. Engineered custom API endpoints to enable seamless ticket creation directly from external spreadsheets, automating the data entry workflow.',
    coordinates: { x: 102, y: 44 },
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    link: CONTACT.github,
    techStack: [
      'API Development',
      'Automation',
      'Notification System',
      'Database',
    ],
  },
  {
    id: 'RAG-HUB',
    title: 'RAG Knowledge Hub',
    category: 'AI Documentation Assistant',
    status: 'BETA',
    description:
      'Built an intelligent knowledge base utilizing Retrieval-Augmented Generation (RAG) architecture. Integrated vector search logic to enable accurate, context-aware answers from technical documentation, streamlining information retrieval for users.',
    coordinates: { x: 45, y: 99 },
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    link: CONTACT.github,
    techStack: ['RAG', 'Vector Search', 'AI Integration', 'Technical Docs'],
  },
  {
    id: 'PORTFOLIO',
    title: 'Fashion Brand Portfolio',
    category: 'Web Development',
    status: 'VERIFIED',
    description:
      'Designed and deployed a high-performance, visually driven portfolio website. Focused on Responsive Design principles and semantic HTML using Next.js to ensure optimal SEO performance and seamless rendering across all mobile and desktop devices.',
    coordinates: { x: 89, y: 12 },
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    link: CONTACT.github,
    techStack: ['Next.js', 'Semantic HTML', 'SEO', 'Responsive Design'],
  },
];
