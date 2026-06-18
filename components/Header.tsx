'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Send } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === 'light';

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 80px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <Image
          src="/logo_clodd_white.png"
          alt="Clodd"
          width={74}
          height={24}
          unoptimized
          style={{
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
            filter: isLight ? 'invert(1)' : 'none',
            transition: 'filter 0.3s ease',
          }}
          priority
        />

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Contact */}
          <a
            href="https://t.me/sergey_bochkarev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s ease',
              display: 'none',
            }}
            className="contact-link"
          >
            @sergey_bochkarev
          </a>

          {/* CTA Button */}
          <motion.a
            href="https://t.me/sergey_bochkarev"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 100,
              background: 'var(--accent-lime)',
              color: '#0B0A24',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(200, 242, 92, 0.25)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <Send size={13} strokeWidth={2.5} />
            Обсудить проект
          </motion.a>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              aria-label="Toggle theme"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: '1px solid var(--card-border)',
                background: 'var(--pill-bg)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </motion.button>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .contact-link { display: block !important; }
        }
        @media (max-width: 768px) {
          .header-inner { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </motion.header>
  );
}
