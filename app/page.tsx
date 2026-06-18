'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Navigation, Category } from '@/components/Navigation';
import { WorkCard, Work } from '@/components/WorkCard';
import { VideoModal } from '@/components/VideoModal';
import { Footer } from '@/components/Footer';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  creative: 'Creative',
  awards: 'Awards',
  animation: 'Animation',
};

const CATEGORY_ORDER = ['awards', 'commercial', 'creative', 'animation'];

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<{ id: string; aspectRatio?: string } | null>(null);

  useEffect(() => {
    fetch('/works.json')
      .then((r) => r.json())
      .then((data) => {
        setWorks(data.works);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'all'
      ? works
      : works.filter((w) => w.categories.includes(activeCategory));

  const grouped: Record<string, Work[]> = {};
  filtered.forEach((w) => {
    const catsToGroup = activeCategory === 'all' ? w.categories : [activeCategory];
    catsToGroup.forEach((cat) => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(w);
    });
  });
  if (grouped['awards']) {
    grouped['awards'].sort((a, b) => (a.awards_order ?? 999) - (b.awards_order ?? 999));
  }

  const orderedCategories =
    activeCategory === 'all'
      ? CATEGORY_ORDER.filter((c) => grouped[c])
      : [activeCategory].filter((c) => grouped[c]);

  let cardIndex = 0;

  return (
    <>
      <VideoModal kinescopeId={playing?.id ?? null} aspectRatio={playing?.aspectRatio} onClose={() => setPlaying(null)} />
      <Header />

      <main
        style={{
          minHeight: '100vh',
          paddingTop: 88,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial purple glow — top right */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            top: -120,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(169, 156, 245, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 80px',
            position: 'relative',
            zIndex: 1,
          }}
          className="content-wrapper"
        >
          {/* Navigation */}
          <div
            style={{
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Navigation active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div>
              {orderedCategories.map((cat) => {
                const catWorks = grouped[cat];
                return (
                  <Section
                    key={cat}
                    label={CATEGORY_LABELS[cat] ?? cat}
                    count={catWorks.length}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                        gap: 16,
                      }}
                    >
                      {catWorks.map((work) => {
                        const i = cardIndex++;
                        return (
                          <WorkCard
                            key={`${cat}-${work.id}`}
                            work={work}
                            index={i}
                            onPlay={(id, aspectRatio) => setPlaying({ id, aspectRatio })}
                          />
                        );
                      })}
                    </div>
                  </Section>
                );
              })}

              {orderedCategories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '80px 0',
                    color: 'var(--text-muted)',
                    fontSize: 15,
                  }}
                >
                  Работы в этой категории скоро появятся
                </motion.div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ marginBottom: 56 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {label}
        </h2>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'var(--pill-bg)',
            border: '1px solid var(--pill-border)',
            borderRadius: 100,
            padding: '2px 9px',
            letterSpacing: '-0.01em',
          }}
        >
          {count}
        </span>
      </div>

      {children}
    </motion.section>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      {[3, 4].map((count, si) => (
        <div key={si} style={{ marginBottom: 56 }}>
          <div
            style={{
              width: 120,
              height: 22,
              borderRadius: 6,
              background: 'var(--card-bg)',
              marginBottom: 20,
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: 16,
            }}
          >
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <>
      <style>{`
        @keyframes sk-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid var(--card-border)',
          background: 'var(--card-bg)',
        }}
      >
        <div
          style={{
            aspectRatio: '16/9',
            background: 'var(--pill-bg)',
            animation: 'sk-pulse 1.8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            padding: '14px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 60,
              height: 9,
              borderRadius: 4,
              background: 'var(--card-border)',
            }}
          />
          <div
            style={{
              width: '80%',
              height: 15,
              borderRadius: 6,
              background: 'var(--card-border)',
            }}
          />
          <div
            style={{
              width: '100%',
              height: 12,
              borderRadius: 4,
              background: 'var(--card-border)',
            }}
          />
        </div>
      </div>
    </>
  );
}
