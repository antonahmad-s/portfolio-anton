import { Project, MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  { label: 'System Overview', id: 'hero', index: 1 },
  { label: 'Identity Core', id: 'about', index: 2 },
  { label: 'Execution Logs', id: 'experience', index: 3 },
  { label: 'Inventory', id: 'skills', index: 4 },
  { label: 'Portfolio', id: 'portfolio', index: 5 },
];

export const PROJECTS: Project[] = [
  {
    id: 'QA-AUTO-01',
    title: 'Katalon Automation Suite',
    category: 'QA Automation',
    status: 'VERIFIED',
    description:
      'Full regression suite for Financial Core Systems. Reduced manual testing time by 70% through automated script execution.',
    coordinates: { x: 102, y: 44 },
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop',
    link: 'https://github.com/antonahmad-s',
    techStack: ['Katalon', 'Groovy', 'Jenkins', 'Git'],
  },
  {
    id: 'WEB-AI-02',
    title: 'Blueprint Portfolio',
    category: 'Next.js + GSAP',
    status: 'VERIFIED',
    description:
      'Immersive portfolio site featuring GSAP animations, Lenis scroll, and Brutalist architecture designed for Awwwards.',
    coordinates: { x: 89, y: 12 },
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    link: 'https://github.com/antonahmad-s',
    techStack: ['Next.js 15', 'GSAP', 'Tailwind', 'TypeScript'],
  },
  {
    id: 'AI-CHAT-03',
    title: 'QA Knowledge Bot',
    category: 'AI & Hono',
    status: 'PENDING',
    description:
      'RAG-based chatbot engine designed to query massive technical documentation for automated test case generation.',
    coordinates: { x: 45, y: 99 },
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    link: 'https://github.com/antonahmad-s',
    techStack: ['Hono', 'OpenAI API', 'Vector DB', 'React'],
  },
];
