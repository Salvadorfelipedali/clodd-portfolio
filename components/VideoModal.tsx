'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  kinescopeId: string | null;
  aspectRatio?: string;
  onClose: () => void;
}

function ModalContent({ kinescopeId, aspectRatio, onClose }: VideoModalProps) {
  const isVertical = aspectRatio === '9:16';
  const isSquare = aspectRatio === '1:1';
  const is4x3 = aspectRatio === '4:3';

  // Touch/mobile detection — runs only on client (modal is always client-side)
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  });

  // Desktop-only fullscreen state
  const [ourFullscreen, setOurFullscreen] = useState(false);
  const [requestingFS, setRequestingFS] = useState(false);
  const [showFSControls, setShowFSControls] = useState(false);

  const ourFSRef = useRef(false);
  const justExitedFSRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isFS = !isMobile && (ourFullscreen || requestingFS);

  const setFS = (v: boolean) => { ourFSRef.current = v; setOurFullscreen(v); };

  const containerStyle: React.CSSProperties = isFS && isVertical
    ? { height: '100vh', width: '56.25vh', maxWidth: '100vw', aspectRatio: '9/16' }
    : isFS && is4x3
    ? { height: '100vh', width: 'calc(100vh * 4 / 3)', maxWidth: '100vw', aspectRatio: '4/3' }
    : isVertical
    ? { height: '80vh', maxHeight: '80vh', maxWidth: '80vw', aspectRatio: '9/16' }
    : isSquare
    ? { width: 'min(70vh, 70vw)', aspectRatio: '1/1' }
    : is4x3
    ? { width: 'min(75vw, calc(80vh * 4 / 3))', aspectRatio: '4/3' }
    : { width: '85vw', maxWidth: 1000, aspectRatio: '16/9' };

  // Desktop-only: custom fullscreen toggle
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      // Directly mutate DOM before requestFullscreen — bypasses React/Framer scheduling
      if (overlayRef.current) overlayRef.current.style.backgroundColor = '#000';
      if (containerRef.current) {
        containerRef.current.style.borderRadius = '0';
        containerRef.current.style.boxShadow = 'none';
        if (isVertical) {
          containerRef.current.style.height = '100vh';
          containerRef.current.style.width = '56.25vh';
          containerRef.current.style.maxWidth = '100vw';
        } else if (is4x3) {
          containerRef.current.style.height = '100vh';
          containerRef.current.style.width = 'calc(100vh * 4 / 3)';
          containerRef.current.style.maxWidth = '100vw';
        }
      }
      setRequestingFS(true);
      overlayRef.current?.requestFullscreen().catch(() => {
        setRequestingFS(false);
        if (overlayRef.current) overlayRef.current.style.backgroundColor = '';
        if (containerRef.current) {
          containerRef.current.style.borderRadius = '';
          containerRef.current.style.boxShadow = '';
          containerRef.current.style.height = '';
          containerRef.current.style.width = '';
          containerRef.current.style.maxWidth = '';
        }
      });
    }
  };

  // Desktop-only: mouse move to show/hide controls in fullscreen
  const handleMouseMove = () => {
    if (!ourFSRef.current) return;
    setShowFSControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowFSControls(false), 2000);
  };

  // Desktop-only: fullscreen change listener
  useEffect(() => {
    if (isMobile) return;
    const handleFSChange = () => {
      if (document.fullscreenElement === overlayRef.current) {
        setRequestingFS(false);
        setFS(true);
        setShowFSControls(false);
      } else if (!document.fullscreenElement) {
        setRequestingFS(false);
        // Block overlay click and Escape for 200ms after ANY fullscreen exit
        justExitedFSRef.current = true;
        setTimeout(() => { justExitedFSRef.current = false; }, 200);

        if (ourFSRef.current) {
          // Only clean up direct DOM mutations when exiting OUR custom fullscreen.
          // For Kinescope's native fullscreen (horizontal videos), ourFSRef is false
          // and we never set these inline styles — clearing them would strip React's
          // managed style and make the overlay transparent without triggering a re-render.
          setFS(false);
          setShowFSControls(false);
          if (hideTimer.current) clearTimeout(hideTimer.current);
          if (overlayRef.current) overlayRef.current.style.backgroundColor = '';
          if (containerRef.current) {
            containerRef.current.style.borderRadius = '';
            containerRef.current.style.boxShadow = '';
            containerRef.current.style.height = '';
            containerRef.current.style.width = '';
            containerRef.current.style.maxWidth = '';
          }
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, [isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !ourFSRef.current && !justExitedFSRef.current) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [onClose]);

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleMouseMove}
      onClick={(e) => { if (e.target === overlayRef.current && !justExitedFSRef.current) handleClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: isFS ? '#000' : 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: ourFullscreen && !showFSControls ? 'none' : 'default',
      }}
    >
      <button
        onClick={handleClose}
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
          opacity: ourFullscreen ? (showFSControls ? 1 : 0) : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: ourFullscreen && !showFSControls ? 'none' : 'auto',
        }}
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          ...containerStyle,
          borderRadius: isFS ? 0 : 12,
          overflow: 'hidden',
          backgroundColor: '#000',
          boxShadow: isFS ? 'none' : '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {kinescopeId && (
          <iframe
            src={`https://kinescope.io/embed/${kinescopeId}?autoplay=1`}
            width="100%"
            height="100%"
            allow={(!isMobile && (isVertical || is4x3))
              ? 'autoplay; picture-in-picture; encrypted-media'
              : 'autoplay; fullscreen; picture-in-picture; encrypted-media'}
            allowFullScreen={isMobile || (!isVertical && !is4x3)}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              border: 'none',
              width: '100%',
              height: '100%',
              // scale(1.04) hides Kinescope player chrome/corners via overflow:hidden clipping.
              // In desktop fullscreen scale(1.01) is enough — avoids clipping the controls bar.
              transform: isFS ? 'scale(1.01)' : 'scale(1.04)',
              transformOrigin: 'center center',
            }}
          />
        )}

        {/* Desktop-only fullscreen button for vertical and 4:3 videos */}
        {!isMobile && (isVertical || is4x3) && (
          <button
            onClick={toggleFullscreen}
            aria-label={ourFullscreen ? 'Выйти из полного экрана' : 'Полный экран'}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              zIndex: 5,
              opacity: ourFullscreen ? (showFSControls ? 1 : 0) : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: ourFullscreen && !showFSControls ? 'none' : 'auto',
            }}
          >
            {ourFullscreen
              ? <Minimize2 size={15} strokeWidth={2} />
              : <Maximize2 size={15} strokeWidth={2} />}
          </button>
        )}
      </div>
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
