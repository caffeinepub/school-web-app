import { ImageLightbox } from "../components/ImageLightbox";

const TOPPERS_DATA = [
  { className: "Class VIII", students: ["Anubhav", "Harsh", "Simran"] },
  { className: "Class VII", students: ["Shashi", "Gudiya", "Laxman"] },
  { className: "Class VI", students: ["Chirag", "Aakash", "Shikha"] },
  { className: "Class V", students: ["Khushboo", "Deeksha", "Tinku"] },
  { className: "Class IV", students: ["Palak", "Radhika", "Viresh"] },
  { className: "Class III", students: ["Muskan", "Anjali", "Atharv"] },
  { className: "Class II", students: ["Kuldeep", "Mayank", "Himanshu"] },
  { className: "Class I", students: ["Harshit", "Atif", "Mahnoor"] },
  { className: "UKG (B)", students: ["Deepanshi", "Ankit", "Rajit"] },
  { className: "UKG (A)", students: ["Dipanshu", "Aayush Sharma", "Shubhash"] },
  { className: "LKG (B)", students: ["Shrishti", "Vansh Rana", "Lakshita"] },
  { className: "LKG (A)", students: ["Saloni", "Nishant", "Anjali / Ram"] },
  { className: "NC", students: ["Pushpendra", "Taimur", "Keshav"] },
  { className: "Extra", students: ["Nitin", "", ""] },
] as const;

const RANK_BADGES = [
  {
    emoji: "🥇",
    label: "1st",
    borderColor: "oklch(0.78 0.168 85 / 0.6)",
    badgeBg: "oklch(0.78 0.168 85 / 0.15)",
    badgeText: "oklch(0.92 0.168 85)",
    badgeBorder: "oklch(0.78 0.168 85 / 0.5)",
    glow: "oklch(0.78 0.168 85 / 0.10)",
  },
  {
    emoji: "🥈",
    label: "2nd",
    borderColor: "oklch(0.72 0.02 0 / 0.5)",
    badgeBg: "oklch(0.70 0.02 0 / 0.12)",
    badgeText: "oklch(0.85 0.01 0)",
    badgeBorder: "oklch(0.70 0.02 0 / 0.4)",
    glow: "oklch(0.70 0.02 0 / 0.06)",
  },
  {
    emoji: "🥉",
    label: "3rd",
    borderColor: "oklch(0.65 0.12 55 / 0.5)",
    badgeBg: "oklch(0.65 0.12 55 / 0.12)",
    badgeText: "oklch(0.78 0.12 55)",
    badgeBorder: "oklch(0.65 0.12 55 / 0.4)",
    glow: "oklch(0.65 0.12 55 / 0.06)",
  },
] as const;

interface TopperCardProps {
  emoji: string;
  label: string;
  name: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glow: string;
}

function TopperCard({
  emoji,
  label,
  name,
  borderColor,
  badgeBg,
  badgeText,
  badgeBorder,
  glow,
}: TopperCardProps) {
  if (!name) return null;
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "oklch(0.240 0.040 265)",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 2px 20px ${glow}`,
      }}
    >
      {/* Rank badge */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <span
          className="text-xs font-bold font-body uppercase tracking-[0.15em] px-3 py-1 rounded-full"
          style={{
            background: badgeBg,
            color: badgeText,
            border: `1px solid ${badgeBorder}`,
          }}
        >
          {label} Rank
        </span>
      </div>
      {/* Student name */}
      <p
        className="font-display font-semibold text-lg leading-snug"
        style={{ color: "oklch(0.95 0.012 80)" }}
      >
        {name}
      </p>
    </div>
  );
}

export function StudentsPage() {
  return (
    <div className="min-h-screen">
      {/* ── Page Header ─────────────────────────────────── */}
      <div
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.05 265) 0%, oklch(0.185 0.035 268) 100%)",
          borderBottom: "1px solid oklch(0.36 0.052 265 / 0.5)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.78 0.168 85 / 0.07) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl relative">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Academic Excellence
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            Student <span className="gradient-text-gold">Toppers</span>
          </h1>
        </div>
      </div>

      {/* ── Top Performers Section ───────────────────────── */}
      <section
        data-ocid="students.toppers.section"
        className="py-14 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Session 2025–26
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 30px oklch(0.78 0.168 85 / 0.12)",
              }}
            >
              🏆 Top Performers
            </h2>
            <div
              className="w-20 h-0.5 mx-auto mt-5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
              }}
            />
          </div>

          {/* Class cards grid */}
          <div className="flex flex-col gap-10">
            {TOPPERS_DATA.map(({ className, students }) => (
              <div key={className}>
                {/* Class heading */}
                <div className="flex items-center gap-4 mb-5">
                  <p
                    className="text-sm uppercase tracking-[0.25em] font-bold font-body whitespace-nowrap"
                    style={{ color: "oklch(0.78 0.168 85)" }}
                  >
                    {className}
                  </p>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.4), transparent)",
                    }}
                  />
                </div>

                {/* 3 topper cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {RANK_BADGES.map((badge, idx) => {
                    const name = students[idx] as string | undefined;
                    if (!name) return null;
                    return (
                      <TopperCard
                        key={badge.label}
                        emoji={badge.emoji}
                        label={badge.label}
                        name={name}
                        borderColor={badge.borderColor}
                        badgeBg={badge.badgeBg}
                        badgeText={badge.badgeText}
                        badgeBorder={badge.badgeBorder}
                        glow={badge.glow}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Computer Lab & Activities Images ─────────────── */}
      <section
        data-ocid="students.gallery.section"
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              School Life
            </p>
            <h2
              className="font-display font-bold text-2xl sm:text-3xl"
              style={{ color: "oklch(0.95 0.012 80)" }}
            >
              Computer Lab &amp; Activities
            </h2>
          </div>
          {/* Flexible grid — add more images later without breaking layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.04-PM-2.jpeg",
                alt: "Students in computer lab",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.04-PM-1--3.jpeg",
                alt: "Students learning computers",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.02-PM-1--5.jpeg",
                alt: "R D S school students group",
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
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
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "500px",
                      objectFit: "contain",
                      display: "block",
                      borderRadius: "0.5rem",
                    }}
                  />
                </div>
              </ImageLightbox>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
