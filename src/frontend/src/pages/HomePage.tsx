import { Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Instagram,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageLightbox } from "../components/ImageLightbox";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Reusable gallery image with shimmer-on-load and fade-in transition
function GalleryImage({
  src,
  alt,
  minHeight,
  maxHeight,
}: {
  src: string;
  alt: string;
  minHeight?: string;
  maxHeight?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: minHeight ?? "200px",
        overflow: "hidden",
        borderRadius: "0.5rem",
      }}
    >
      {/* Shimmer skeleton — hidden once image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "0.5rem",
            background:
              "linear-gradient(90deg, oklch(0.18 0.035 266) 0%, oklch(0.24 0.04 265) 40%, oklch(0.18 0.035 266) 80%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite linear",
            zIndex: 1,
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: maxHeight ?? "500px",
          objectFit: "contain",
          display: "block",
          borderRadius: "0.5rem",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s ease",
          position: "relative",
          zIndex: 2,
        }}
      />
    </div>
  );
}

// Animated count-up hook
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  delay = 0,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  active?: boolean;
}) {
  const count = useCountUp(value, 1800, active);
  return (
    <div
      className="stat-glow card-premium rounded-xl p-6 text-center relative overflow-hidden"
      style={{
        background: "oklch(0.240 0.040 265)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background:
            "radial-gradient(circle at top right, oklch(0.78 0.168 85), transparent 70%)",
        }}
      />
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto"
        style={{
          background: "oklch(0.78 0.168 85 / 0.12)",
          border: "1px solid oklch(0.78 0.168 85 / 0.3)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "oklch(0.78 0.168 85)" }} />
      </div>
      <div
        className="font-display font-bold text-4xl sm:text-5xl mb-1 glow-gold-text-subtle"
        style={{ color: "oklch(0.88 0.168 85)" }}
      >
        {count}
        {suffix}
      </div>
      <div
        className="text-sm font-medium tracking-wide"
        style={{ color: "oklch(0.80 0.04 265)" }}
      >
        {label}
      </div>
    </div>
  );
}

export function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  const galleryHeaderRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const openAdmission = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-admission-popup"));
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-ocid="home.hero.section"
        className="relative min-h-[90vh] flex items-center justify-center"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/saraswati-hero-bg.dim_1920x1080.jpg"
            alt="Maa Saraswati divine background"
            className="w-full h-full object-cover object-center"
          />
          <div className="bg-hero-overlay absolute inset-0" />
          {/* Additional dark overlay for readability */}
          <div
            className="absolute inset-0"
            style={{ background: "oklch(0.08 0.035 268 / 0.65)" }}
          />
          {/* Vignette edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, oklch(0.09 0.038 268 / 0.6) 100%)",
            }}
          />
        </div>

        {/* Decorative particles */}
        {(() => {
          const PARTICLE_IDS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;
          return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {PARTICLE_IDS.map((id, i) => (
                <div
                  key={id}
                  className="absolute rounded-full opacity-20"
                  style={{
                    width: `${2 + (i % 3)}px`,
                    height: `${2 + (i % 3)}px`,
                    background: "oklch(0.88 0.168 85)",
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 4) * 15}%`,
                    filter: "blur(0.5px)",
                    boxShadow: "0 0 6px oklch(0.78 0.168 85 / 0.5)",
                  }}
                />
              ))}
            </div>
          );
        })()}

        {/* Hero content — two-column layout on desktop */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-28 lg:pb-24">
          {/* Mobile: centered stack. Desktop: flex row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              {/* School Logo — circular badge above WELCOME TO */}
              <div
                className="inline-flex items-center justify-center opacity-0 animate-fade-in"
                style={{ animationFillMode: "forwards" }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid oklch(0.78 0.168 85 / 0.6)",
                    boxShadow:
                      "0 0 28px oklch(0.78 0.168 85 / 0.3), 0 0 60px oklch(0.78 0.168 85 / 0.1)",
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(8px)",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/assets/uploads/WhatsApp-Image-2026-03-03-at-8.14.47-PM-1-6.jpeg"
                    alt="R D S Meena Memorial Public School Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              {/* Eyebrow */}
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.3em] font-body font-semibold opacity-0 animate-fade-in delay-100"
                style={{
                  color: "oklch(0.78 0.168 85)",
                  animationFillMode: "forwards",
                }}
              >
                Welcome to
              </p>

              {/* Main heading */}
              <h1
                className="font-display font-bold leading-tight opacity-0 animate-fade-in delay-200"
                style={{ animationFillMode: "forwards" }}
              >
                <span
                  className="gradient-text-gold block text-3xl sm:text-4xl lg:text-4xl"
                  style={{
                    filter:
                      "drop-shadow(0 0 24px oklch(0.78 0.168 85 / 0.4)) drop-shadow(0 0 60px oklch(0.78 0.168 85 / 0.15))",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  R D S Meena Memorial Public School
                </span>
                <span
                  className="block text-2xl sm:text-3xl mt-1"
                  style={{
                    color: "oklch(0.88 0.04 80)",
                    textShadow: "0 2px 24px oklch(0 0 0 / 0.4)",
                  }}
                >
                  Bahjoi (Sambhal)
                </span>
              </h1>

              {/* Gold divider */}
              <div
                className="opacity-0 animate-fade-in delay-300 mx-auto lg:mx-0"
                style={{
                  width: "120px",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                  boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.6)",
                  animationFillMode: "forwards",
                }}
              />

              <p
                className="text-lg sm:text-xl lg:text-xl max-w-lg leading-relaxed opacity-0 animate-fade-in delay-400"
                style={{
                  color: "oklch(0.82 0.015 80)",
                  textShadow: "0 1px 8px oklch(0 0 0 / 0.4)",
                  animationFillMode: "forwards",
                }}
              >
                Shaping tomorrow's leaders through a tradition of{" "}
                <em
                  className="font-display not-italic"
                  style={{ color: "oklch(0.88 0.168 85)" }}
                >
                  academic excellence
                </em>
                , integrity, and innovation.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in delay-500"
                style={{ animationFillMode: "forwards" }}
              >
                <button
                  type="button"
                  data-ocid="home.admission.open_modal_button"
                  onClick={openAdmission}
                  className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold font-body tracking-wide"
                >
                  🎓 Admission Open
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  to="/about"
                  data-ocid="home.about.link"
                  className="btn-gold-outline inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold font-body tracking-wide"
                >
                  Discover Our Story
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN — Owner Portrait ── */}
            <div
              className="flex flex-col items-center gap-4 opacity-0 animate-fade-in delay-300 shrink-0"
              style={{
                animationFillMode: "forwards",
                width: "300px",
                minWidth: "280px",
                maxWidth: "300px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  borderRadius: "1.25rem",
                  border: "none",
                  boxShadow:
                    "0 8px 40px oklch(0 0 0 / 0.45), 0 0 0 1.5px oklch(0.78 0.168 85 / 0.35), 0 0 60px oklch(0.78 0.168 85 / 0.12)",
                  maxWidth: "100%",
                  width: "100%",
                  background: "oklch(0.18 0.038 265)",
                  padding: "12px",
                  position: "relative",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Gold top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    borderRadius: "1.25rem 1.25rem 0 0",
                    background:
                      "linear-gradient(90deg, transparent 0%, oklch(0.78 0.168 85) 40%, oklch(0.92 0.18 85) 60%, oklch(0.78 0.168 85) 80%, transparent 100%)",
                    boxShadow: "0 0 10px oklch(0.78 0.168 85 / 0.5)",
                  }}
                />
                <img
                  src="/assets/uploads/WhatsApp-Image-2026-03-03-at-8.16.36-PM-1-4.jpeg"
                  alt="Jitendra Pal Meena - Founder & Owner"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "100%",
                    display: "block",
                    objectFit: "contain",
                    objectPosition: "center top",
                    borderRadius: "0.75rem",
                  }}
                />
              </div>
              <div className="text-center">
                <p
                  style={{
                    color: "oklch(0.88 0.168 85)",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0 0 20px oklch(0.78 0.168 85 / 0.5), 0 2px 8px oklch(0 0 0 / 0.3)",
                  }}
                >
                  Jitendra Pal Meena
                </p>
                <p
                  style={{
                    color: "oklch(0.80 0.04 265)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginTop: "4px",
                  }}
                >
                  Founder &amp; Owner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to top, oklch(0.200 0.035 268), transparent)",
          }}
        />
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section
        data-ocid="home.stats.section"
        ref={statsRef}
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
          borderBottom: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              icon={Users}
              label="Total Students"
              value={300}
              suffix="+"
              active={statsActive}
              delay={0}
            />
            <StatCard
              icon={BookOpen}
              label="Total Teachers"
              value={16}
              active={statsActive}
              delay={100}
            />
            <StatCard
              icon={Star}
              label="Total Classes"
              value={13}
              active={statsActive}
              delay={200}
            />
            <StatCard
              icon={Star}
              label="Years of Excellence"
              value={10}
              suffix="+"
              active={statsActive}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ── Announcements ─────────────────────────────────────── */}
      <section
        data-ocid="home.announcements.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-3">
            <Bell
              className="w-5 h-5"
              style={{ color: "oklch(0.78 0.168 85)" }}
            />
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Latest Updates
            </p>
          </div>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl mb-2"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            School Announcements
          </h2>
          <div className="gold-divider mb-12" style={{ width: "80px" }} />

          {/* Single centered announcement card */}
          <div className="max-w-2xl mx-auto">
            <article
              data-ocid="home.announcements.item.1"
              className="card-premium rounded-xl p-8 flex flex-col gap-4 text-center"
              style={{
                background: "oklch(0.240 0.040 265)",
                border: "1px solid oklch(0.78 0.168 85 / 0.35)",
                boxShadow: "0 0 40px oklch(0.78 0.168 85 / 0.08)",
              }}
            >
              {/* Gold accent top bar */}
              <div
                className="w-16 h-0.5 mx-auto mb-2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                }}
              />
              <h3
                className="font-display font-bold text-xl sm:text-2xl leading-snug"
                style={{ color: "oklch(0.92 0.015 80)" }}
              >
                Admissions Open for Session 2026–27
              </h3>
              <div className="space-y-2">
                <p
                  className="text-base font-medium"
                  style={{ color: "oklch(0.82 0.015 80)" }}
                >
                  Enroll Now for NC to Class 8
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                >
                  Limited Seats Available
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.80 0.04 265)" }}
                >
                  Contact School Office for Details
                </p>
              </div>
              <div
                className="w-16 h-0.5 mx-auto mt-2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.168 85 / 0.5), transparent)",
                }}
              />
            </article>
          </div>
        </div>
      </section>

      {/* ── School Gallery ────────────────────────────────────── */}
      <section
        data-ocid="home.gallery.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10 reveal" ref={galleryHeaderRef}>
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              School Life
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{ color: "oklch(0.95 0.012 80)" }}
            >
              School <span className="gradient-text-gold">Gallery</span>
            </h2>
            <div
              className="mx-auto mt-4"
              style={{
                width: "60px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
              }}
            />
          </div>
          {/* Flexible grid — add more images here without breaking layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.03-PM-11.jpeg",
                alt: "R D S school announcement banner",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.02-PM-9.jpeg",
                alt: "R D S students and staff",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-15-at-11.00.01-PM-1.jpeg",
                alt: "Republic Day celebration at R D S school - students and teachers",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-15-at-11.00.02-PM-2.jpeg",
                alt: "Republic Day group photo at R D S school",
              },
            ].map((img) => (
              <ImageLightbox key={img.src} src={img.src} alt={img.alt}>
                <div
                  style={{
                    background: "oklch(0.240 0.040 265)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 20px oklch(0 0 0 / 0.3)",
                    padding: "8px",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                      "border-color 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "oklch(0.78 0.168 85 / 0.5)";
                    el.style.boxShadow =
                      "0 4px 28px oklch(0 0 0 / 0.3), 0 0 20px oklch(0.78 0.168 85 / 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "oklch(0.78 0.168 85 / 0.2)";
                    el.style.boxShadow = "0 4px 20px oklch(0 0 0 / 0.3)";
                  }}
                >
                  <GalleryImage
                    src={img.src}
                    alt={img.alt}
                    minHeight="380px"
                    maxHeight="500px"
                  />
                </div>
              </ImageLightbox>
            ))}
          </div>
        </div>
      </section>

      {/* ── Annual Sports Function Gallery ────────────────────── */}
      <section
        data-ocid="home.sports.gallery.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.210 0.04 267)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              School Events
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              Annual Sports Function{" "}
              <span className="gradient-text-gold">Gallery</span>
            </h2>
            <div
              className="mx-auto mt-4"
              style={{
                width: "80px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-06-at-10.59.51-PM-1.jpeg",
                alt: "Annual Sports Function – students with medals and teachers",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-06-at-11.02.01-PM-2.jpeg",
                alt: "Annual Sports Function – prize distribution ceremony",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-06-at-10.59.53-PM-3.jpeg",
                alt: "Annual Sports Function – prize distribution to students",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-06-at-10.59.52-PM-4.jpeg",
                alt: "Annual Sports Function – boys with medals and teachers",
              },
            ].map((img, idx) => (
              <ImageLightbox key={img.src} src={img.src} alt={img.alt}>
                <div
                  data-ocid={`home.sports.gallery.item.${idx + 1}`}
                  style={{
                    background: "oklch(0.240 0.040 265)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                    borderRadius: "0.875rem",
                    boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)",
                    padding: "10px",
                    cursor: "pointer",
                    transition:
                      "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "oklch(0.78 0.168 85 / 0.55)";
                    el.style.boxShadow =
                      "0 6px 32px oklch(0 0 0 / 0.35), 0 0 24px oklch(0.78 0.168 85 / 0.12)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "oklch(0.78 0.168 85 / 0.2)";
                    el.style.boxShadow = "0 4px 24px oklch(0 0 0 / 0.3)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <GalleryImage src={img.src} alt={img.alt} maxHeight="420px" />
                </div>
              </ImageLightbox>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Us / Contact ────────────────────────────────── */}
      <section
        data-ocid="home.about.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              About Us
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              Get In <span className="gradient-text-gold">Touch</span>
            </h2>
          </div>

          <div className="max-w-xl mx-auto">
            <div
              className="card-premium rounded-2xl px-8 py-10 flex flex-col gap-8"
              style={{
                background: "oklch(0.240 0.040 265)",
                border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                boxShadow:
                  "0 0 60px oklch(0.78 0.168 85 / 0.07), 0 20px 40px oklch(0 0 0 / 0.25)",
              }}
            >
              {/* Contact Numbers */}
              <div>
                <p
                  className="text-xs font-bold font-body uppercase tracking-[0.2em] mb-4"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                >
                  Contact Numbers
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:+918279968905"
                    data-ocid="home.contact.phone.link"
                    className="flex items-center gap-3 group transition-colors"
                    style={{ color: "oklch(0.82 0.015 80)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                      style={{
                        background: "oklch(0.78 0.168 85 / 0.1)",
                        border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                      }}
                    >
                      <Phone
                        className="w-4 h-4"
                        style={{ color: "oklch(0.78 0.168 85)" }}
                      />
                    </div>
                    <span className="font-body text-base font-medium group-hover:text-gold transition-colors">
                      +91 82799 68905
                    </span>
                  </a>
                  <a
                    href="tel:+919756940494"
                    data-ocid="home.contact.phone2.link"
                    className="flex items-center gap-3 group transition-colors"
                    style={{ color: "oklch(0.82 0.015 80)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                      style={{
                        background: "oklch(0.78 0.168 85 / 0.1)",
                        border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                      }}
                    >
                      <Phone
                        className="w-4 h-4"
                        style={{ color: "oklch(0.78 0.168 85)" }}
                      />
                    </div>
                    <span className="font-body text-base font-medium group-hover:text-gold transition-colors">
                      +91 97569 40494
                    </span>
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px"
                style={{ background: "oklch(0.28 0.052 265 / 0.5)" }}
              />

              {/* Follow Us */}
              <div>
                <p
                  className="text-xs font-bold font-body uppercase tracking-[0.2em] mb-4"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                >
                  Follow Us
                </p>
                <a
                  href="https://www.instagram.com/rdsschool_7"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="home.contact.instagram.link"
                  className="flex items-center gap-3 group transition-colors"
                  style={{ color: "oklch(0.82 0.015 80)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                    style={{
                      background: "oklch(0.78 0.168 85 / 0.1)",
                      border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    }}
                  >
                    <Instagram
                      className="w-4 h-4"
                      style={{ color: "oklch(0.78 0.168 85)" }}
                    />
                  </div>
                  <span className="font-body text-base font-medium group-hover:text-gold transition-colors">
                    @rdsschool_7
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
