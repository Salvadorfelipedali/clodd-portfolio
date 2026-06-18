'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{
        borderTop: '1px solid var(--card-border)',
        marginTop: 80,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: 'var(--text-muted2)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        AI-Portfolio · © Clodd. Все права защищены.
      </span>
    </motion.footer>
  );
}
