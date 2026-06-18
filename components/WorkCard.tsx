'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon, Trophy, Clock } from 'lucide-react';

const loadedThumbs = new Set<string>();

export interface Work {
  id: number;
  type: 'video' | 'photo';
  categories: string[];
  brand: string;
  title: string;
  description: string;
  duration: string | null;
  award: string | null;
  thumbnail: string;
  kinescope_id?: string;
  thumbnail_url?: string;
  aspect_ratio?: string;
  awards_order?: number;
}

interface WorkCardProps {
  work: Work;
  index: number;
  onPlay?: (kinescopeId: string, aspectRatio?: string) => void;
}

const GRADIENTS = [
  'linear-gradient(135deg, #1a1845 0%, #2d1b69 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #081c15 100%)',
  'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%)',
  'linear-gradient(135deg, #0b0a24 0%, #a99cf5 50%, #4f3b78 100%)',
  'linear-gradient(135deg, #191970 0%, #341f97 50%, #1a0a2e 100%)',
  'linear-gradient(135deg, #0b3d91 0%, #1560bd 50%, #00b4d8 100%)',
  'linear-gradient(135deg, #3d0000 0%, #8b0000 50%, #ff6b6b 100%)',
  'linear-gradient(135deg, #004d40 0%, #00695c 50%, #26a69a 100%)',
  'linear-gradient(135deg, #1a237e 0%, #283593 50%, #5c6bc0 100%)',
  'linear-gradient(135deg, #37474f 0%, #546e7a 50%, #9FD9F5 100%)',
  'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #e040fb 100%)',
];

function shortenAward(award: string): string {
  return award
    .replace(/^Победа в номинации\s*«([^»]+)»/, '$1')
    .replace('Ассоциация Нейрокреаторов', 'Нейрокреаторы')
    .trim();
}

export function WorkCard({ work, index, onPlay }: WorkCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const thumbUrl = work.thumbnail_url ?? '';
  const [thumbLoaded, setThumbLoaded] = useState(() => loadedThumbs.has(thumbUrl));
  const imgRef = useRef<HTMLImageElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const gradient = GRADIENTS[index % GRADIENTS.length];
  const hasVideo = work.type === 'video' && !!work.kinescope_id;

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [work.description]);

  useEffect(() => {
    if (!thumbLoaded && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      loadedThumbs.add(thumbUrl);
      setThumbLoaded(true);
    }
  }, []);


  function handlePlay() {
    if (hasVideo && work.kinescope_id && onPlay) {
      onPlay(work.kinescope_id, work.aspect_ratio);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4 }}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid var(--card-border)',
        background: 'var(--card-bg)',
        cursor: 'default',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-hover-border)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(169, 156, 245, 0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={hasVideo ? handlePlay : undefined}
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: '#0d0d1a',
          borderRadius: '14px 14px 0 0',
          margin: 0,
          padding: 0,
          lineHeight: 0,
          fontSize: 0,
          cursor: hasVideo ? 'pointer' : 'default',
        }}
      >
        {hasVideo && (
          <img
            ref={imgRef}
            src={thumbUrl}
            alt=""
            onLoad={() => { loadedThumbs.add(thumbUrl); setThumbLoaded(true); }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              border: 'none',
              opacity: thumbLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              work.type === 'video'
                ? 'linear-gradient(to bottom, transparent 40%, rgba(11, 10, 36, 0.6) 100%)'
                : 'linear-gradient(to bottom, transparent 50%, rgba(11, 10, 36, 0.5) 100%)',
          }}
        />

        {/* Play button */}
        {work.type === 'video' && (
          <button
            onClick={handlePlay}
            aria-label={`Play ${work.title}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: hasVideo
                ? 'rgba(255, 255, 255, 0.22)'
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: hasVideo ? 'pointer' : 'default',
              padding: 0,
              outline: 'none',
            }}
          >
            <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
          </button>
        )}

        {/* Bottom right badges */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {work.type === 'video' && work.duration && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 9px',
                borderRadius: 100,
                background: 'rgba(11, 10, 36, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              <Clock size={10} strokeWidth={2.5} />
              {work.duration}
            </span>
          )}
          {work.type === 'photo' && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 100,
                background: 'rgba(11, 10, 36, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: 11,
              }}
            >
              <ImageIcon size={11} strokeWidth={2} />
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px' }}>
        {work.brand && (
          <div
            style={{
              display: 'inline-block',
              color: 'var(--brand-label-color)',
              background: 'var(--brand-label-bg)',
              padding: 'var(--brand-label-padding)',
              borderRadius: 'var(--brand-label-radius)',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 5,
            }}
          >
            {work.brand}
          </div>
        )}

        {work.title && (
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: 5,
            }}
          >
            {work.title}
          </div>
        )}

        {/* Description with 2-line clamp */}
        {work.description && (
          <div style={{ marginBottom: work.award ? 10 : 0 }}>
            <div
              ref={descRef}
              style={{
                color: 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.5,
                ...(expanded
                  ? {}
                  : {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }),
              }}
            >
              {work.description}
            </div>
            {overflows && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--accent-lime-text)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 2,
                  opacity: 0.85,
                }}
              >
                читать далее
              </button>
            )}
          </div>
        )}

        {work.award && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 100,
              background: 'var(--award-badge-bg)',
              border: '1px solid var(--award-badge-border)',
              color: 'var(--accent-lime-text)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <Trophy size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {shortenAward(work.award)}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
