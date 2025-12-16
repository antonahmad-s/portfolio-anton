'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

/**
 * Contact Footer Component
 *
 * @security Email obfuscation prevents bot harvesting
 * @a11y ARIA labels for screen readers
 * @performance Static generation eligible
 */
export default function ContactFooter() {
  const [copied, setCopied] = useState(false);

  // 🔒 Email obfuscation (prevents bot scraping)
  // Generate your own: echo -n "your.email@example.com" | base64
  const email = atob('YW50b25haG1hZEBleGFtcGxlLmNvbQ=='); // Replace with your Base64 encoded email

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/antonahmad-s',
      label: 'View GitHub Profile',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/antonahmad',
      label: 'Connect on LinkedIn',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/6281296064974', // Replace with actual number
      label: 'Chat on WhatsApp',
    },
  ];

  return (
    <footer
      id="contact"
      className="relative z-10 px-6 md:px-12 py-24 bg-paper border-t border-ink/10"
      role="contentinfo"
    >
      <div className="max-w-[100rem] mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-xs text-accent bg-ink px-2 py-1 mb-4">
              KERNEL_INFO
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-ink">
              Jakarta State University
            </h2>
            <p className="font-mono text-muted">
              Informatics Engineering • 2019-2023
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="flex flex-col items-start md:items-end gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email Button with Copy */}
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="group relative bg-ink text-paper px-8 py-4 font-mono font-bold hover:bg-accent hover:text-ink transition-all duration-300 text-lg overflow-hidden"
                aria-label="Send email to Anton Ahmad Susilo"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Mail size={20} />
                  INITIATE_COMMUNICATION()
                </span>

                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-accent -z-10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </a>

              {/* Copy Email Button */}
              <button
                onClick={handleCopyEmail}
                className="p-4 bg-ink/10 hover:bg-accent/20 text-ink transition-colors duration-300 border border-ink/20"
                aria-label="Copy email address"
                title="Copy email"
              >
                {copied ? (
                  <Check size={20} className="text-success" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-ink font-mono text-sm hover:text-accent transition-colors duration-300"
                    aria-label={link.label}
                  >
                    <IconComponent size={18} />
                    <span className="uppercase tracking-wider">
                      {link.name}
                    </span>
                    <ExternalLink
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 border-t border-ink/10">
          <p className="font-mono text-[10px] uppercase text-muted tracking-wider">
            Anton Ahmad Susilo © {new Date().getFullYear()} • All Rights
            Reserved
          </p>

          {/* <div className="flex items-center gap-6 font-mono text-[10px] uppercase text-muted">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              SYSTEM_ONLINE
            </span>
            <span>BLUEPRINT_VER_3.0</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
