// Types for the portfolio application

export interface Project {
  id: string;
  title: string;
  category: string;
  status: 'VERIFIED' | 'PENDING' | 'DEPRECATED';
  description: string;
  coordinates: { x: number; y: number };
  imageUrl: string;
  link: string;
  techStack: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface InspectionData {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface MenuItem {
  label: string;
  id: string;
  index: number;
}

export type ThemeMode = 'light' | 'dark';
