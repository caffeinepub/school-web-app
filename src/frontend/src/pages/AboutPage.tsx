import {
  Award,
  CheckCircle2,
  Heart,
  Lightbulb,
  Quote,
  Shield,
} from "lucide-react";
import { ImageLightbox } from "../components/ImageLightbox";

const CORE_VALUES = [
  {
    icon: Award,
    title: "Excellence",
    desc: "We hold ourselves to the highest academic and personal standards, celebrating achievement in every form — intellectual, artistic, athletic, and social.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Honesty and ethical conduct are the foundations of our community. We act with courage and transparency in all our endeavours.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Curiosity drives us forward. We foster creative thinking, embrace new ideas, and equip students to solve the challenges of tomorrow.",
  },
  {
    icon: Heart,
    title: "Community",
    desc: "Every student, teacher, and family is valued. We build belonging through inclusion, empathy, and shared responsibility for each other's success.",
  },
];

const SCHOOL_HIGHLIGHTS = [
  "Classes: NC to 8th",
  "CBSE Based Curriculum",
  "Computer Lab Facility",
  "Sports & Games",
  "Van Transport Facility",
  "Focus on English Speaking & Communication",
  "Experienced & Caring Teachers",
  "Regular Tests & Progress Reports",
  "Disciplined and Safe Environment",
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
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
              "radial-gradient(ellipse, oklch(0.78 0.168 85 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl relative">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Our Story
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl mb-4"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            About{" "}
            <span className="gradient-text-gold">
              R D S Meena Memorial Public School
            </span>
          </h1>
          <p
            className="text-base max-w-xl"
            style={{ color: "oklch(0.80 0.04 265)" }}
          >
            Nurturing bright minds, building character, and shaping futures.
            Learn who we are and what drives us.
          </p>
        </div>
      </div>

      {/* ── Mission Statement ── */}
      <section
        data-ocid="about.mission.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="relative rounded-2xl px-8 sm:px-14 py-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.255 0.05 265) 0%, oklch(0.240 0.040 265) 100%)",
              border: "1px solid oklch(0.78 0.168 85 / 0.22)",
              boxShadow:
                "0 0 60px oklch(0.78 0.168 85 / 0.06), 0 20px 40px oklch(0 0 0 / 0.25)",
            }}
          >
            {/* Decorative quote icon */}
            <div
              className="absolute top-6 left-8 opacity-20"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              <Quote className="w-12 h-12" />
            </div>
            <div
              className="absolute bottom-6 right-8 opacity-20 rotate-180"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              <Quote className="w-12 h-12" />
            </div>

            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-6"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Our Mission
            </p>
            <blockquote
              className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.12)",
              }}
            >
              To inspire every student to reach their highest potential through{" "}
              <span className="gradient-text-gold italic">
                rigorous learning
              </span>
              ,{" "}
              <span className="gradient-text-gold italic">
                compassionate guidance
              </span>
              , and{" "}
              <span className="gradient-text-gold italic">
                a deep love of discovery
              </span>
              .
            </blockquote>
            <p
              className="text-base leading-relaxed max-w-2xl mx-auto"
              style={{ color: "oklch(0.82 0.04 265)" }}
            >
              At R D S Meena Memorial Public School, education is not merely the
              transmission of knowledge — it is the cultivation of wisdom,
              curiosity, and the courage to act with purpose in an ever-changing
              world.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section
        data-ocid="about.highlights.section"
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
          borderBottom: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Our Journey
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.12)",
              }}
            >
              What We <span className="gradient-text-gold">Offer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCHOOL_HIGHLIGHTS.map((item, i) => (
              <div
                key={item}
                data-ocid={`about.highlights.item.${i + 1}`}
                className="card-premium rounded-lg py-3 px-4 flex items-center gap-3"
                style={{
                  background: "oklch(0.240 0.040 265)",
                  border: "1px solid oklch(0.38 0.052 265 / 0.5)",
                }}
              >
                <CheckCircle2
                  className="w-5 h-5 shrink-0"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                />
                <span
                  className="font-body text-sm font-medium"
                  style={{ color: "oklch(0.88 0.015 80)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section
        data-ocid="about.values.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ paddingBottom: "4rem" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              What We Stand For
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.12)",
              }}
            >
              Our Core <span className="gradient-text-gold">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="card-premium rounded-xl p-6 flex flex-col items-center text-center gap-4"
                  style={{ background: "oklch(0.240 0.040 265)" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: "oklch(0.78 0.168 85 / 0.1)",
                      border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "oklch(0.78 0.168 85)" }}
                    />
                  </div>
                  <h3
                    className="font-display font-semibold text-lg"
                    style={{ color: "oklch(0.92 0.015 80)" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.78 0.04 265)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our School Images ── */}
      <section
        data-ocid="about.gallery.section"
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
              Our School
            </h2>
          </div>
          {/* Flexible grid — add more images here without breaking layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.01-PM-8.jpeg",
                alt: "R D S school students with medals",
              },
              {
                src: "/assets/uploads/WhatsApp-Image-2026-03-03-at-9.18.02-PM-2--10.jpeg",
                alt: "R D S Meena Memorial Public School admission poster",
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
