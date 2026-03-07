import { ImageLightbox } from "../components/ImageLightbox";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const RANKS = [
  {
    rank: "1st",
    label: "1st Place",
    borderColor: "oklch(0.78 0.168 85 / 0.6)",
    badgeBg: "oklch(0.78 0.168 85 / 0.15)",
    badgeText: "oklch(0.88 0.168 85)",
    badgeBorder: "oklch(0.78 0.168 85 / 0.5)",
    glow: "oklch(0.78 0.168 85 / 0.08)",
  },
  {
    rank: "2nd",
    label: "2nd Place",
    borderColor: "oklch(0.7 0.02 0 / 0.5)",
    badgeBg: "oklch(0.7 0.02 0 / 0.12)",
    badgeText: "oklch(0.82 0.01 0)",
    badgeBorder: "oklch(0.7 0.02 0 / 0.4)",
    glow: "oklch(0.7 0.02 0 / 0.05)",
  },
  {
    rank: "3rd",
    label: "3rd Place",
    borderColor: "oklch(0.65 0.12 55 / 0.5)",
    badgeBg: "oklch(0.65 0.12 55 / 0.12)",
    badgeText: "oklch(0.75 0.12 55)",
    badgeBorder: "oklch(0.65 0.12 55 / 0.4)",
    glow: "oklch(0.65 0.12 55 / 0.05)",
  },
] as const;

function PlaceholderField({ label }: { label: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span
        className="font-body font-semibold text-xs shrink-0"
        style={{ color: "oklch(0.80 0.04 265)" }}
      >
        {label}:
      </span>
      <span
        className="font-body"
        style={{ color: "oklch(0.58 0.025 265)", fontStyle: "italic" }}
      >
        ___
      </span>
    </div>
  );
}

function RankBox({
  rank,
  classNum,
}: {
  rank: (typeof RANKS)[number];
  classNum: number;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "oklch(0.240 0.040 265)",
        border: `1px solid ${rank.borderColor}`,
        boxShadow: `0 0 24px ${rank.glow}`,
        opacity: 0.85,
      }}
    >
      {/* Rank badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold font-body uppercase tracking-[0.2em] px-3 py-1 rounded-full"
          style={{
            background: rank.badgeBg,
            color: rank.badgeText,
            border: `1px solid ${rank.badgeBorder}`,
          }}
        >
          {rank.rank}
        </span>
        <span
          className="text-[10px] font-body uppercase tracking-wider"
          style={{ color: "oklch(0.58 0.025 265)" }}
        >
          Class {classNum}
        </span>
      </div>

      {/* Placeholder fields */}
      <div className="flex flex-col gap-2 mt-1">
        <PlaceholderField label="Student Name" />
        <PlaceholderField label="Father Name" />
        <PlaceholderField label="Class" />
        <PlaceholderField label="Village" />
      </div>
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

      {/* ── Announcement Banner ──────────────────────────── */}
      <section
        data-ocid="students.announcement.section"
        className="py-10 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.185 0.035 268)" }}
      >
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-2xl px-8 py-7 text-center"
            style={{
              background: "oklch(0.240 0.040 265)",
              border: "1px solid oklch(0.78 0.168 85 / 0.35)",
              boxShadow: "0 0 40px oklch(0.78 0.168 85 / 0.08)",
            }}
          >
            {/* Gold accent line */}
            <div
              className="w-14 h-0.5 mx-auto mb-5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
              }}
            />
            <p
              className="font-display text-xl font-semibold italic leading-relaxed"
              style={{
                color: "oklch(0.88 0.168 85)",
                textShadow: "0 0 20px oklch(0.78 0.168 85 / 0.25)",
              }}
            >
              Topper details will be announced soon.
            </p>
            <div
              className="w-14 h-0.5 mx-auto mt-5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85 / 0.5), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Topper Grid ─────────────────────────────────── */}
      <section
        data-ocid="students.toppers.section"
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-col gap-12">
          {CLASSES.map((classNum) => (
            <div key={classNum} data-ocid={`students.class.${classNum}`}>
              {/* Class header */}
              <div className="flex items-center gap-4 mb-6">
                <p
                  className="text-xs uppercase tracking-[0.3em] font-semibold font-body"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                >
                  Class {classNum}
                </p>
                <div
                  className="flex-1 h-px"
                  style={{ background: "oklch(0.38 0.052 265 / 0.5)" }}
                />
              </div>

              {/* 3 rank boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RANKS.map((rank) => (
                  <RankBox key={rank.rank} rank={rank} classNum={classNum} />
                ))}
              </div>
            </div>
          ))}
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
