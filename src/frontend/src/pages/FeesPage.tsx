import { useScrollReveal } from "../hooks/useScrollReveal";

const FEES_ROWS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
] as const;

export function FeesPage() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const tableRef = useScrollReveal<HTMLDivElement>();
  const noteRef = useScrollReveal<HTMLParagraphElement>();
  const contactRef = useScrollReveal<HTMLDivElement>();

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
            Academic Year 2026–27
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            Fees <span className="gradient-text-gold">Structure</span>
          </h1>
        </div>
      </div>

      {/* ── Fees Table Section ── */}
      <section
        data-ocid="fees.section"
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.185 0.035 268)" }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-12 reveal">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              R D S Meena Memorial Public School
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl mb-3"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              Monthly Fees <span className="gradient-text-gold">Schedule</span>
            </h2>
            {/* Decorative horizontal rule */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div
                style={{
                  flex: 1,
                  maxWidth: "120px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.168 85 / 0.5))",
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "oklch(0.78 0.168 85)",
                  boxShadow: "0 0 10px oklch(0.78 0.168 85 / 0.7)",
                }}
              />
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.6), oklch(0.78 0.168 85))",
                  boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "oklch(0.78 0.168 85)",
                  boxShadow: "0 0 10px oklch(0.78 0.168 85 / 0.7)",
                }}
              />
              <div
                style={{
                  flex: 1,
                  maxWidth: "120px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.5), transparent)",
                }}
              />
            </div>
            <p
              className="font-body text-sm font-medium mb-3"
              style={{
                color: "oklch(0.78 0.168 85 / 0.85)",
                letterSpacing: "0.05em",
              }}
            >
              Monthly Fee Schedule – Session 2026-27
            </p>
            <p
              className="font-body text-sm max-w-xl mx-auto"
              style={{ color: "oklch(0.76 0.04 265)" }}
            >
              The following schedule lists monthly fees for each class. Fees
              will be updated by the school administration.
            </p>
          </div>

          {/* Table wrapper */}
          <div
            ref={tableRef}
            className="reveal mx-auto"
            style={{ maxWidth: "780px" }}
          >
            <div
              className="card-premium rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.240 0.040 265)",
                border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                boxShadow:
                  "0 0 60px oklch(0.78 0.168 85 / 0.08), 0 20px 40px oklch(0 0 0 / 0.3)",
              }}
            >
              <table
                data-ocid="fees.table"
                className="w-full"
                style={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                {/* Table Head */}
                <thead>
                  <tr
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.18), oklch(0.78 0.168 85 / 0.1))",
                    }}
                  >
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "oklch(0.92 0.168 85)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid oklch(0.78 0.168 85 / 0.35)",
                      }}
                    >
                      Class
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "right",
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "oklch(0.92 0.168 85)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid oklch(0.78 0.168 85 / 0.35)",
                      }}
                    >
                      Monthly Fees (₹)
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {FEES_ROWS.map((cls, i) => (
                    <tr
                      key={cls}
                      data-ocid={`fees.row.${i + 1}`}
                      style={{
                        borderBottom:
                          i < FEES_ROWS.length - 1
                            ? "1px solid oklch(0.28 0.052 265 / 0.5)"
                            : "none",
                        background:
                          i % 2 === 1
                            ? "oklch(0.78 0.168 85 / 0.02)"
                            : "transparent",
                        transition: "background 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = "oklch(0.78 0.168 85 / 0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background =
                          i % 2 === 1
                            ? "oklch(0.78 0.168 85 / 0.02)"
                            : "transparent";
                      }}
                    >
                      {/* Class name */}
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "oklch(0.88 0.015 80)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          {/* Row number badge */}
                          <span
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              borderRadius: "50%",
                              background: "oklch(0.78 0.168 85 / 0.1)",
                              border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                              color: "oklch(0.78 0.168 85)",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {i + 1}
                          </span>
                          {cls}
                        </span>
                      </td>

                      {/* Monthly fees — to be announced */}
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          textAlign: "right",
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span
                          style={{
                            color: "oklch(0.68 0.03 265)",
                            fontStyle: "italic",
                            letterSpacing: "0.01em",
                          }}
                        >
                          To be announced
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note below table */}
            <p
              ref={noteRef}
              className="reveal text-center font-body text-sm mt-6"
              style={{
                color: "oklch(0.76 0.04 265)",
                lineHeight: 1.6,
              }}
            >
              ℹ️ Fees details will be updated by the school administration.
              <br />
              For current fee information, please contact the school office.
            </p>
          </div>

          {/* Contact callout */}
          <div
            ref={contactRef}
            className="mt-12 max-w-lg mx-auto text-center reveal"
          >
            <div
              style={{
                borderRadius: "1rem",
                padding: "1.25rem 2rem",
                background: "oklch(0.240 0.040 265)",
                border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                boxShadow: "0 0 30px oklch(0.78 0.168 85 / 0.06)",
              }}
            >
              <p
                className="font-body text-sm mb-1"
                style={{ color: "oklch(0.80 0.04 265)" }}
              >
                For fees enquiry, contact school office:
              </p>
              <a
                href="tel:+916395297305"
                style={{
                  color: "oklch(0.88 0.168 85)",
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  textDecoration: "none",
                  textShadow: "0 0 16px oklch(0.78 0.168 85 / 0.4)",
                }}
              >
                📞 6395297305
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
