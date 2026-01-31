"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { photos } from "./photos";
import { photoMetaByFilename, relationshipStartDate } from "./photoMeta.generated";

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function FlowerSvg({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g>
        <path
          d="M32 18c3.2-7.3 12-9.3 16.7-4.6S51.4 26.9 44 30.1c7.4 1.3 12 8.9 8.8 15.4S40.7 53.3 35.5 48c1.3 7.4-5.7 13.3-13.5 10.9S11 47.2 16.3 42c-7.4 1.3-13.3-5.7-10.9-13.5S16.8 17.3 22 22.6C20.7 15.2 27.7 9.3 35.5 11.7s11 11.7 6.5 16.3C39.6 21.1 35.7 18 32 18Z"
          fill="rgba(255, 144, 177, 0.92)"
        />
        <circle cx="32" cy="32" r="8" fill="rgba(255, 245, 160, 0.95)" />
        <circle cx="29" cy="29" r="2.4" fill="rgba(255, 205, 86, 0.95)" />
      </g>
    </svg>
  );
}

function CelebrationOverlay({ active, seed, origin }) {
  const originLeft = origin?.x != null ? `${origin.x}px` : "50vw";
  const originTop = origin?.y != null ? `${origin.y}px` : "35vh";

  const confetti = useMemo(() => {
    const rand = mulberry32(seed * 1009 + 17);
    const colors = ["#ff2d6d", "#ffd166", "#9bf6ff", "#bdb2ff", "#caffbf", "#ffd6e8"];
    return Array.from({ length: 140 }, (_, i) => {
      const size = 8 + Math.floor(rand() * 11); // 8..18px
      const w = size;
      const h = Math.max(4, Math.round(size * (0.38 + rand() * 0.4)));
      const bx = `${(rand() * 2 - 1) * (14 + rand() * 18)}vw`;
      const by = `${-(18 + rand() * 24)}vh`;
      const ex = `${(rand() * 2 - 1) * (8 + rand() * 16)}vw`;
      const ey = `${110 + rand() * 30}vh`;
      const delay = rand() * 0.35; // s
      const dur = 3.1 + rand() * 2.8; // s
      const rot = Math.round(rand() * 360); // deg
      const color = colors[i % colors.length];
      const radius = rand() < 0.18 ? 999 : 2;
      return { i, w, h, bx, by, ex, ey, delay, dur, rot, color, radius };
    });
  }, [seed]);

  const flowers = useMemo(() => {
    const rand = mulberry32(seed * 733 + 29);
    return Array.from({ length: 32 }, (_, i) => {
      const size = 22 + Math.floor(rand() * 28); // 22..49px
      const bx = `${(rand() * 2 - 1) * (10 + rand() * 14)}vw`;
      const by = `${-(14 + rand() * 20)}vh`;
      const ex = `${(rand() * 2 - 1) * (6 + rand() * 14)}vw`;
      const ey = `${112 + rand() * 26}vh`;
      const delay = rand() * 0.75; // s
      const dur = 4.1 + rand() * 3.9; // s
      const rot = Math.round(rand() * 360); // deg
      const opacity = 0.74 + rand() * 0.2;
      const hue = Math.round(rand() * 320);
      return { i, size, bx, by, ex, ey, delay, dur, rot, opacity, hue };
    });
  }, [seed]);

  if (!active) return null;

  return (
    <div className="celebration-overlay" aria-hidden="true">
      {confetti.map((p) => (
        <span
          key={`c-${seed}-${p.i}`}
          className="confetti-piece"
          style={{
            left: originLeft,
            top: originTop,
            width: `${p.w}px`,
            height: `${p.h}px`,
            backgroundColor: p.color,
            borderRadius: `${p.radius}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ["--rot"]: `${p.rot}deg`,
            ["--bx"]: p.bx,
            ["--by"]: p.by,
            ["--ex"]: p.ex,
            ["--ey"]: p.ey,
          }}
        />
      ))}
      {flowers.map((f) => (
        <span
          key={`f-${seed}-${f.i}`}
          className="flower-fall"
          style={{
            left: originLeft,
            top: originTop,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
            ["--rot"]: `${f.rot}deg`,
            ["--bx"]: f.bx,
            ["--by"]: f.by,
            ["--ex"]: f.ex,
            ["--ey"]: f.ey,
            filter: `hue-rotate(${f.hue}deg) saturate(1.12)`,
          }}
        >
          <FlowerSvg className="flower-fall__svg" />
        </span>
      ))}
    </div>
  );
}

function PersistentFlowersOverlay({ flowers }) {
  if (!flowers?.length) return null;
  return (
    <div className="persistent-flowers" aria-hidden="true">
      {flowers.map((f) => (
        <span
          key={f.key}
          className="flower-stay"
          style={{
            left: `${f.left}vw`,
            top: `${f.top}vh`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            ["--rot"]: `${f.rot}deg`,
            ["--wiggle"]: `${f.wiggleDeg}deg`,
            ["--floatY"]: `${f.floatY}px`,
            ["--dur"]: `${f.dur}s`,
            filter: `hue-rotate(${f.hue}deg) saturate(1.12)`,
          }}
        >
          <FlowerSvg className="flower-stay__svg" />
        </span>
      ))}
    </div>
  );
}

function stableDelay(photo) {
  // Deterministic "random-ish" delay from the filename (keeps React render pure).
  let hash = 0;
  for (let i = 0; i < photo.length; i += 1) {
    hash = (hash * 31 + photo.charCodeAt(i)) >>> 0;
  }

  const ms = hash % 2000; // 0..1999ms
  return `${ms / 1000}s`;
}

function getHeartPoints(numPoints, width, height) {
  const points = [];
  // Responsive scale: larger on big screens, still fits on small screens.
  // Heart width is ~32*scale, height is ~34*scale (roughly), so scale off viewport.
  const minDim = Math.min(width, height);
  // Fill a bit more of the viewport on phones so points aren't as cramped.
  const fillFactor = minDim <= 420 ? 0.86 : 0.9;
  const scale = Math.max(12, Math.min(width / 32, height / 34) * fillFactor);
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;

    // Parametric heart equation
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y =
      -scale *
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t));

    points.push({
      x: centerX + x,
      y: centerY + y,
    });
  }

  return points;
}

function parseDateOnly(dateOnly) {
  if (!dateOnly) return null;
  const match = String(dateOnly).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = Date.UTC(y, m - 1, d);
  if (Number.isNaN(utc)) return null;
  return new Date(utc);
}

function diffDaysUtc(a, b) {
  // a - b in whole days, using UTC-midnight anchored Dates
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((a.getTime() - b.getTime()) / msPerDay);
}

function thumbSrcFor(photo) {
  const thumbName = String(photo).replace(/\.[^.]+$/, ".jpg");
  return `/cindy/_thumbs/${thumbName}`;
}

function webSrcFor(photo) {
  const webName = String(photo).replace(/\.[^.]+$/, ".jpg");
  return `/cindy/_web/${webName}`;
}

export default function HeartPhotos() {
  const [points, setPoints] = useState([]);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [celebrationSeed, setCelebrationSeed] = useState(1);
  const [celebrationOrigin, setCelebrationOrigin] = useState(() => ({ x: null, y: null }));
  const [persistentFlowers, setPersistentFlowers] = useState([]);
  const [zByPhoto, setZByPhoto] = useState(() => ({}));
  const [photoSizePx, setPhotoSizePx] = useState(40);
  const rafIdRef = useRef(null);
  const topZRef = useRef(20); // > hover z-index (10); still under card due to container stacking context
  const celebrationSeedRef = useRef(1);
  const yesTimeoutRef = useRef(null);
  const yesBtnRef = useRef(null);
  const heartRef = useRef(null);

  const animationDelays = useMemo(() => photos.map(stableDelay), []);
  const yesScale = Math.min(1 + noCount * 0.28, 3.75);

  const bringToFront = (photo) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setZByPhoto((prev) => {
      if (prev[photo] === nextZ) return prev;
      return { ...prev, [photo]: nextZ };
    });
  };

  const triggerYesCelebration = () => {
    const rect = yesBtnRef.current?.getBoundingClientRect?.() || null;
    if (rect) {
      setCelebrationOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setCelebrationOrigin({ x: null, y: null });
    }

    setAccepted(true);

    const nextSeed = (celebrationSeedRef.current % 100000) + 1;
    celebrationSeedRef.current = nextSeed;
    setCelebrationSeed(nextSeed);
    setCelebrationActive(true);

    setPersistentFlowers((prev) => {
      if (prev?.length) return prev;

      const rand = mulberry32(nextSeed * 911 + 3);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPhone = w <= 520;
      const count = isPhone ? 42 : 64;

      const doc = document;
      const expandRect = (rectLike, pad) => ({
        x0: rectLike.left - pad,
        y0: rectLike.top - pad,
        x1: rectLike.right + pad,
        y1: rectLike.bottom + pad,
      });

      // Exclusions: keep flowers off the card and the tip bubble.
      const exclusions = [];
      const cardEl = doc.querySelector(".valentine-card");
      const tipEl = doc.querySelector(".photo-tip");
      const pad = isPhone ? 18 : 22;
      if (cardEl?.getBoundingClientRect) exclusions.push(expandRect(cardEl.getBoundingClientRect(), pad));
      if (tipEl?.getBoundingClientRect) exclusions.push(expandRect(tipEl.getBoundingClientRect(), pad));

      if (exclusions.length === 0) {
        exclusions.push({
          x0: w * 0.18,
          y0: 0,
          x1: w * 0.82,
          y1: Math.min(h * 0.26, 210),
        });
      }

      const intersectsAnyExclusion = (x, y, r) =>
        exclusions.some((e) => x >= e.x0 - r && x <= e.x1 + r && y >= e.y0 - r && y <= e.y1 + r);

      const randomSizePx = () => {
        const small = rand() < 0.55;
        return small ? 18 + Math.floor(rand() * 22) : 30 + Math.floor(rand() * 38); // px
      };

      // A few loose cluster centers to make things feel less uniform.
      const clusterCenters = [];
      const makeCenter = () => {
        const margin = 28;
        for (let i = 0; i < 60; i += 1) {
          const x = margin + rand() * (w - margin * 2);
          const y = margin + rand() * (h - margin * 2);
          if (!intersectsAnyExclusion(x, y, 40)) return { x, y };
        }
        return { x: w * (0.2 + rand() * 0.6), y: h * (0.2 + rand() * 0.6) };
      };
      clusterCenters.push(makeCenter(), makeCenter(), makeCenter());

      const samplePosition = () => {
        const mode = rand() < 0.38 ? "cluster" : "uniform";
        if (mode === "cluster") {
          const c = clusterCenters[Math.floor(rand() * clusterCenters.length)];
          // Approx normal using sum-of-uniforms.
          const dx = (rand() + rand() + rand() + rand() - 2) * (w * 0.11);
          const dy = (rand() + rand() + rand() + rand() - 2) * (h * 0.11);
          return { x: c.x + dx, y: c.y + dy };
        }

        // Uniform but with some edge/top/bottom preference for a natural "frame".
        const edgeBand = 0.22;
        let x;
        if (rand() < 0.55) {
          x = rand() < 0.5 ? rand() * (w * edgeBand) : w * (1 - edgeBand) + rand() * (w * edgeBand);
        } else {
          x = rand() * w;
        }

        let y;
        const rY = rand();
        if (rY < 0.22) y = rand() * (h * 0.3); // use top portion too
        else if (rY < 0.44) y = h * 0.68 + rand() * (h * 0.32); // bottom
        else y = rand() * h;

        return { x, y };
      };

      const placed = [];
      const basePad = isPhone ? 6 : 8;
      const maxAttemptsPerFlower = isPhone ? 120 : 160;

      for (let i = 0; i < count; i += 1) {
        const size = randomSizePx();
        const r = size * 0.55;

        let chosen = null;

        for (let attempt = 0; attempt < maxAttemptsPerFlower; attempt += 1) {
          const { x: rawX, y: rawY } = samplePosition();
          const margin = Math.max(10, r) + 6;
          const x = Math.max(margin, Math.min(w - margin, rawX));
          const y = Math.max(margin, Math.min(h - margin, rawY));

          if (intersectsAnyExclusion(x, y, r)) continue;

          let ok = true;
          for (const p of placed) {
            const d = Math.hypot(x - p.x, y - p.y);
            // Add randomness so it doesn't look like a perfect grid.
            let required = (r + p.r) * (0.68 + rand() * 0.5) + basePad;
            // Gradually relax the requirement as we keep trying.
            required *= 1 - (attempt / maxAttemptsPerFlower) * 0.22;
            if (d < required) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          chosen = { x, y, r };
          break;
        }

        // Last resort: place it anyway (still respecting exclusions) with no spacing constraints.
        if (!chosen) {
          for (let attempt = 0; attempt < 80; attempt += 1) {
            const { x: rawX, y: rawY } = samplePosition();
            const margin = Math.max(10, r) + 6;
            const x = Math.max(margin, Math.min(w - margin, rawX));
            const y = Math.max(margin, Math.min(h - margin, rawY));
            if (intersectsAnyExclusion(x, y, r)) continue;
            chosen = { x, y, r };
            break;
          }
        }

        if (!chosen) continue;
        placed.push(chosen);

        const rot = Math.round(rand() * 360);
        const hue = Math.round(rand() * 320);
        const opacity = 0.62 + rand() * 0.28;
        const wiggleDeg = 6 + rand() * 12;
        const floatY = 5 + rand() * 12;
        const dur = 3.2 + rand() * 4.2;

        placed[placed.length - 1].data = {
          key: `stay-${nextSeed}-${i}`,
          left: (chosen.x / w) * 100,
          top: (chosen.y / h) * 100,
          size,
          rot,
          hue,
          opacity,
          wiggleDeg,
          floatY,
          dur,
        };
      }

      return placed.map((p) => p.data).filter(Boolean);
    });

    if (yesTimeoutRef.current) window.clearTimeout(yesTimeoutRef.current);
    yesTimeoutRef.current = window.setTimeout(() => {
      setCelebrationActive(false);
      yesTimeoutRef.current = null;
    }, 5600);
  };

  useEffect(() => {
    const recalc = () => {
      const rect = heartRef.current?.getBoundingClientRect?.() || null;
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? window.innerHeight;

      // Keep the dots readable on mobile, without overwhelming the heart.
      const minDim = Math.min(w, h);
      const nextPhotoSize = Math.max(24, Math.min(44, Math.round(minDim / 14)));

      setPhotoSizePx(nextPhotoSize);
      setPoints(getHeartPoints(photos.length, w, h));
    };

    const onResize = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        recalc();
      });
    };

    recalc();
    window.addEventListener("resize", onResize);
    return () => {
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (yesTimeoutRef.current) {
        window.clearTimeout(yesTimeoutRef.current);
        yesTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!zoomedPhoto) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setZoomedPhoto(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomedPhoto]);

  return (
    <>
      <CelebrationOverlay active={celebrationActive} seed={celebrationSeed} origin={celebrationOrigin} />
      <PersistentFlowersOverlay flowers={persistentFlowers} />

      <div className="valentine-stage">
        <div
          className="heart-container"
          id="heartContainer"
          ref={heartRef}
          style={{ "--photo-size": `${photoSizePx}px` }}
        >
          {photos.map((photo, index) => {
            const point = points[index];
            if (!point) return null;

            return (
              <button
                key={photo}
                type="button"
                className="photo-wrap"
                style={{
                  left: `${point.x - photoSizePx / 2}px`,
                  top: `${point.y - photoSizePx / 2}px`,
                  animationDelay: animationDelays[index],
                  ...(zByPhoto[photo] != null ? { zIndex: zByPhoto[photo] } : {}),
                }}
                onPointerDown={() => bringToFront(photo)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") bringToFront(photo);
                }}
                onClick={() => setZoomedPhoto(photo)}
                aria-label="Zoom photo"
              >
                <Image
                  src={thumbSrcFor(photo)}
                  alt="Memory"
                  fill
                  sizes={`${photoSizePx}px`}
                  quality={60}
                  loading="lazy"
                  fetchPriority="low"
                  className="photo-img"
                />
              </button>
            );
          })}
        </div>

        <div className="valentine-card" aria-live="polite">
          <h1 className="valentine-card__title">Cindy Arom Oh</h1>

          {accepted ? (
            <p className="valentine-card__result">I love you!</p>
          ) : (
            <>
              <p className="valentine-card__question">Will you be my Valentine for Feb 14?</p>
              <div className="valentine-card__buttons">
                <button
                  className="valentine-btn valentine-btn--yes"
                  type="button"
                  ref={yesBtnRef}
                  style={{ transform: `scale(${yesScale})` }}
                  onClick={triggerYesCelebration}
                >
                  Yes
                </button>
                <button
                  className="valentine-btn valentine-btn--no"
                  type="button"
                  onClick={() => setNoCount((c) => c + 1)}
                >
                  No
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="photo-tip" aria-hidden="true">
        Click/tap any floating photo to <span className="photo-tip__em">zoom</span>
      </div>

      {zoomedPhoto ? (
        <div className="lightbox is-open" aria-hidden="false">
          <button
            className="lightbox__backdrop"
            type="button"
            aria-label="Close"
            onClick={() => setZoomedPhoto(null)}
          />
          <figure
            className="lightbox__content"
            role="dialog"
            aria-modal="true"
            aria-label="Zoomed photo"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox__close"
              type="button"
              aria-label="Close"
              onClick={() => setZoomedPhoto(null)}
            >
              ×
            </button>
            {(() => {
              const meta = photoMetaByFilename?.[zoomedPhoto] || null;
              const takenAt = parseDateOnly(meta?.takenAt);
              const start = parseDateOnly(relationshipStartDate);

              const prettyDate = takenAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(takenAt)
                : "Date unknown";

              let relationshipLabel = null;
              if (takenAt && start) {
                const delta = diffDaysUtc(takenAt, start);
                if (delta < 0) {
                  const daysBefore = Math.abs(delta);
                  relationshipLabel =
                    daysBefore === 1
                      ? "1 day before we started dating"
                      : `${daysBefore} days before we started dating`;
                } else {
                  const dayNum = delta + 1; // May 24, 2025 is Day 1
                  relationshipLabel =
                    dayNum === 1 ? "Day 1 — our first day of dating" : `Day ${dayNum} of our relationship`;
                }
              }

              return (
                <div className="lightbox__frame" aria-label="Photo details">
                  <div className="lightbox__frameRow">
                    <div className="lightbox__date">{prettyDate}</div>
                    {relationshipLabel ? (
                      <div className="lightbox__day">{relationshipLabel}</div>
                    ) : (
                      <div className="lightbox__day" aria-hidden="true">
                        &nbsp;
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
            <div className="lightbox__imgWrap">
              <Image
                src={webSrcFor(zoomedPhoto)}
                alt="Zoomed memory"
                fill
                sizes="100vw"
                quality={85}
                priority
                className="lightbox__img"
              />
            </div>
          </figure>
        </div>
      ) : null}
    </>
  );
}

