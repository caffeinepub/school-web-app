import { ImageLightbox } from "../components/ImageLightbox";

const ASSISTANT_TEACHERS = [
  "Rashmi Mam",
  "Harsh Sir",
  "Hemant Sir",
  "Seema Mam",
  "Dipanshu Sir",
  "Jagdish Sir",
  "Surabhi Mam",
  "Aanchal Mam",
  "Pallavi Mam",
  "Samreen Mam",
  "Rakhi Mam",
  "Sucheta Mam",
  "Alsifa Mam",
  "Nikita Mam",
  "Kanchan Mam",
  "Ritu Mam",
] as const;

// Order: Owner → Principal → Management (as requested)
const LEADERSHIP = [
  { name: "Mr. Jitendra Pal Meena", role: "Owner" },
  { name: "Mr. Rohit Tripathi", role: "Principal" },
  { name: "Mrs. Geeta Meena", role: "Management" },
] as const;

function getInitials(name: string) {
  return name
    .replace(/^(Mr\.|Mrs\.|Ms\.)?\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeachersPage() {
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
        {/* Decorative radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.78 0.168 85 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl relative">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Our Educators
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            R D S <span className="gradient-text-gold">Faculty</span>
          </h1>
        </div>
      </div>

      {/* ── Leadership ──────────────────────────────────── */}
      <section
        data-ocid="teachers.leadership.section"
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.185 0.035 268)" }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Section eyebrow */}
          <div className="text-center mb-10">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              School Leadership
            </p>
            <div
              className="mx-auto"
              style={{
                width: "60px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
              }}
            />
          </div>

          {/* Leadership cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {LEADERSHIP.map((person) => (
              <div
                key={person.name}
                className="card-premium rounded-2xl p-8 flex flex-col items-center text-center gap-4"
                style={{
                  background: "oklch(0.240 0.040 265)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                  boxShadow:
                    "0 0 32px oklch(0.78 0.168 85 / 0.06), 0 8px 24px oklch(0 0 0 / 0.2)",
                }}
              >
                {/* Avatar initials */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-display shrink-0"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.12)",
                    border: "2px solid oklch(0.78 0.168 85 / 0.35)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  {getInitials(person.name)}
                </div>

                {/* Role badge */}
                <span
                  className="text-[10px] font-bold font-body uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.12)",
                    color: "oklch(0.88 0.168 85)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                  }}
                >
                  {person.role}
                </span>

                {/* Name */}
                <h3
                  className="font-display font-semibold text-lg leading-snug"
                  style={{ color: "oklch(0.92 0.015 80)" }}
                >
                  {person.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assistant Teachers ───────────────────────────── */}
      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="text-center mb-10">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Assistant Teachers
            </p>
            <div
              className="mx-auto"
              style={{
                width: "60px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
              }}
            />
          </div>

          {/* Teacher list — 2 col grid on desktop */}
          <div
            data-ocid="teachers.faculty.list"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {ASSISTANT_TEACHERS.map((name, index) => (
              <div
                key={name}
                data-ocid={`teachers.item.${index + 1}`}
                className="flex items-center gap-4 rounded-xl px-5 py-4 transition-all"
                style={{
                  background: "oklch(0.240 0.040 265)",
                  border: "1px solid oklch(0.38 0.052 265 / 0.5)",
                }}
              >
                {/* Number badge */}
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.1)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  {index + 1}
                </span>
                {/* Name */}
                <span
                  className="font-body font-medium text-sm"
                  style={{ color: "oklch(0.88 0.015 80)" }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Band ───────────────────────────────────── */}
      <section
        data-ocid="teachers.stats.section"
        className="py-14 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.035 268)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
          borderBottom: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Total Teachers", value: "16" },
              { label: "Male Teachers", value: "5" },
              { label: "Female Teachers", value: "11" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="stat-glow card-premium rounded-xl p-6 text-center relative overflow-hidden"
                style={{ background: "oklch(0.240 0.040 265)" }}
              >
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle at top right, oklch(0.78 0.168 85), transparent 70%)",
                  }}
                />
                <div
                  className="font-display font-bold text-5xl mb-2 glow-gold-text-subtle"
                  style={{ color: "oklch(0.88 0.168 85)" }}
                >
                  {value}
                </div>
                <div
                  className="text-sm font-medium tracking-wide font-body"
                  style={{ color: "oklch(0.80 0.04 265)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Faculty & Students Images ─────────────────────── */}
      <section
        data-ocid="teachers.gallery.section"
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
              Faculty &amp; Students
            </h2>
          </div>
          {/* Flexible grid — add more images here later without breaking layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.03-PM-1--1.jpeg",
                alt: "R D S faculty celebration",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.01-PM-1--7.jpeg",
                alt: "R D S school campus",
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
