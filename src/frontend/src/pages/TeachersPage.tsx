import { useRef, useState } from "react";
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

// ── Teacher Application Form ─────────────────────────────────
function TeacherApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gold = "oklch(0.78 0.168 85)";
  const cardBg = "oklch(0.240 0.040 265)";
  const inputBg = "oklch(0.20 0.038 266)";
  const borderColor = "oklch(0.38 0.052 265 / 0.5)";
  const textMain = "oklch(0.92 0.015 80)";
  const textMuted = "oklch(0.70 0.04 265)";

  const isFormFilled = Object.values(formData).some((v) => v.trim() !== "");
  const canSubmit = isFormFilled || resumeFile !== null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setResumeFile(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setSubmitError("Please fill the form or upload your resume.");
      return;
    }
    setSubmitError("");

    const lines: string[] = [
      "*New Teacher Application — R D S Meena Memorial School*",
    ];
    if (formData.fullName.trim())
      lines.push(`Name: ${formData.fullName.trim()}`);
    if (formData.phone.trim()) lines.push(`Phone: ${formData.phone.trim()}`);
    if (formData.subject.trim())
      lines.push(`Subject: ${formData.subject.trim()}`);
    if (formData.qualification.trim())
      lines.push(`Qualification: ${formData.qualification.trim()}`);
    if (formData.experience.trim())
      lines.push(`Experience: ${formData.experience.trim()}`);
    if (resumeFile)
      lines.push(`Resume: ${resumeFile.name} (attached separately)`);

    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/916395297305?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: "1px solid oklch(0.38 0.052 265 / 0.5)",
    borderRadius: "0.625rem",
    color: textMain,
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    color: textMuted,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: "0.35rem",
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: cardBg,
          border: "1px solid oklch(0.78 0.168 85 / 0.3)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3
          className="font-display font-bold text-xl mb-2"
          style={{ color: gold }}
        >
          Application Sent!
        </h3>
        <p className="text-sm" style={{ color: textMuted }}>
          Thank you for applying. We will contact you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              phone: "",
              subject: "",
              qualification: "",
              experience: "",
            });
            setResumeFile(null);
          }}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.168 85), oklch(0.72 0.168 85))",
            color: "oklch(0.12 0.03 260)",
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: cardBg,
        border: "1px solid oklch(0.78 0.168 85 / 0.25)",
        boxShadow: "0 8px 32px oklch(0 0 0 / 0.2)",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <p
          className="text-xs uppercase tracking-[0.25em] font-semibold font-body mb-1"
          style={{ color: gold }}
        >
          Join Our Team
        </p>
        <h2
          className="font-display font-bold text-2xl sm:text-3xl"
          style={{ color: textMain }}
        >
          Teacher Application
        </h2>
        <p className="mt-2 text-sm" style={{ color: textMuted }}>
          You can either fill the form or upload your resume.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="app-fullName" style={labelStyle}>
            Full Name
          </label>
          <input
            id="app-fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = gold;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="app-phone" style={labelStyle}>
            Phone Number
          </label>
          <input
            id="app-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = gold;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="app-subject" style={labelStyle}>
            Subject
          </label>
          <input
            id="app-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Mathematics, Science, English"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = gold;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
        </div>

        {/* Qualification */}
        <div>
          <label htmlFor="app-qualification" style={labelStyle}>
            Qualification
          </label>
          <input
            id="app-qualification"
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="e.g. B.Ed, M.Sc, B.A."
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = gold;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="app-experience" style={labelStyle}>
            Experience
          </label>
          <input
            id="app-experience"
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 3 years, Fresher"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = gold;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
        </div>

        {/* Resume Upload */}
        <div
          style={{
            borderTop: "1px solid oklch(0.38 0.052 265 / 0.4)",
            paddingTop: "1rem",
          }}
        >
          <label htmlFor="app-resume" style={labelStyle}>
            Upload Resume (PDF or Image)
          </label>
          <button
            type="button"
            className="w-full rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 cursor-pointer transition-all text-left"
            style={{
              background: inputBg,
              border: "1px dashed oklch(0.78 0.168 85 / 0.35)",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={{ fontSize: "1.5rem" }}>📎</span>
            <div className="flex-1">
              {resumeFile ? (
                <>
                  <p className="text-sm font-medium" style={{ color: gold }}>
                    {resumeFile.name}
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    {(resumeFile.size / 1024).toFixed(0)} KB — Click to change
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-sm font-medium"
                    style={{ color: textMain }}
                  >
                    Click to upload resume
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    PDF, JPG, PNG accepted
                  </p>
                </>
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            id="app-resume"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {submitError && (
          <p className="text-sm" style={{ color: "oklch(0.65 0.2 25)" }}>
            {submitError}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: canSubmit
              ? "linear-gradient(135deg, oklch(0.65 0.168 85), oklch(0.72 0.168 85))"
              : "oklch(0.30 0.04 265)",
            color: canSubmit ? "oklch(0.12 0.03 260)" : textMuted,
            border: canSubmit
              ? "none"
              : "1px solid oklch(0.38 0.052 265 / 0.5)",
          }}
        >
          Submit Application
        </button>
      </form>

      {/* Gmail / WhatsApp contact options */}
      <div
        style={{
          marginTop: "1.5rem",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.4)",
          paddingTop: "1.25rem",
        }}
      >
        <p
          className="text-xs text-center font-semibold uppercase tracking-widest mb-3"
          style={{ color: textMuted }}
        >
          Or contact us directly
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:dipanshu6395297305@gmail.com?subject=Teacher Application"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "oklch(0.22 0.05 260)",
              border: "1px solid oklch(0.38 0.052 265 / 0.5)",
              color: textMain,
            }}
          >
            <span>📧</span> Gmail
          </a>
          <a
            href="https://wa.me/916395297305?text=Hello%2C%20I%20want%20to%20apply%20for%20a%20teaching%20position."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "oklch(0.22 0.05 260)",
              border: "1px solid oklch(0.38 0.052 265 / 0.5)",
              color: textMain,
            }}
          >
            <span>💬</span> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
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

      {/* ── Teacher Application Section ─────────────────── */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.185 0.038 266)",
          borderTop: "1px solid oklch(0.38 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <TeacherApplicationForm />
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
