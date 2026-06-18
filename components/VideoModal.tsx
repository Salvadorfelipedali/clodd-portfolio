'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  kinescopeId: string | null;
  aspectRatio?: string;
  onClose: () => void;
}

function ModalContent({ kinescopeId, aspectRatio, onClose }: VideoModalProps) {
  const isVertical = aspectRatio === '9:16';
  const isSquare = aspectRatio === '1:1';
  const containerStyle = isVertical
    ? { height: '80vh', maxHeight: '80vh', maxWidth: '80vw', aspectRatio: '9/16' }
    : isSquare
    ? { width: 'min(70vh, 70vw)', aspectRatio: '1/1' }
    : { width: '85vw', maxWidth: 1000, aspectRatio: '16/9' };
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close video"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          zIndex: 10,
        }}
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      {/* Video container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative',
          ...containerStyle,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {kinescopeId && (
          <iframe
            src={`https://kinescope.io/embed/${kinescopeId}?autoplay=1`}
            width="100%"
            height="100%"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              border: 'none',
              width: '100%',
              height: '100%',
              transform: 'scale(1.04)',
              transformOrigin: 'center center',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function VideoModal({ kinescopeId, aspectRatio, onClose }: VideoModalProps) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {kinescopeId && (
        <ModalContent kinescopeId={kinescopeId} aspectRatio={aspectRatio} onClose={onClose} />
      )}
    </AnimatePresence>,
    document.body
  );
}
