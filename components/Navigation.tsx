'use client';

import { motion, AnimatePresence } from 'framer-motion';

export type Category = 'all' | 'commercial' | 'creative' | 'awards' | 'animation';

const FILTERS: { id: Category; label: string }[] = [
  { id: 'all', label: 'Все работы' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'creative', label: 'Creative' },
  { id: 'awards', label: 'Awards' },
  { id: 'animation', label: 'Animation' },
];

interface NavigationProps {
  active: Category;
  onChange: (cat: Category) => void;
}

export function Navigation({ active, onChange }: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
      }}
      role="navigation"
      aria-label="Category filter"
    >
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <motion.button
            key={f.id}
            onClick={() => onChange(f.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: 'relative',
              padding: '8px 18px',
              borderRadius: 100,
              border: `1px solid ${isActive ? 'transparent' : 'var(--pill-border)'}`,
              background: isActive ? 'var(--pill-active-bg)' : 'var(--pill-bg)',
              color: isActive ? 'var(--pill-active-color)' : 'var(--text-muted)',
              fontSize: 13,
              fontWeight: isActive ? 800 : 500,
              letterSpacing: isActive ? '-0.02em' : '-0.01em',
              cursor: 'pointer',
              transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 100,
                  background: 'var(--pill-active-bg)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {f.label}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
