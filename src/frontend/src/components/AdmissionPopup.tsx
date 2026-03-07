import { ArrowLeft, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { useActor } from "../hooks/useActor";

const CLASSES = [
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

const SESSION_KEY = "rds-admission-shown";
const OPEN_EVENT = "open-admission-popup";

interface AdmissionPopupProps {
  forceOpenRef?: React.MutableRefObject<(() => void) | null>;
}

interface FormData {
  studentName: string;
  fatherName: string;
  village: string;
  admissionClass: string;
  phone: string;
}

type SubmitState = "idle" | "success";

const EMPTY_FORM: FormData = {
  studentName: "",
  fatherName: "",
  village: "",
  admissionClass: "",
  phone: "",
};

const focusGold = "0 0 0 2px oklch(0.78 0.168 85 / 0.18)";
const borderGold = "oklch(0.78 0.168 85)";
const borderNormal = "oklch(0.28 0.052 265 / 0.7)";
const borderError = "oklch(0.577 0.245 27)";

export function AdmissionPopup({ forceOpenRef }: AdmissionPopupProps) {
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"info" | "form">("info");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const forceOpen = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  // Assign forceOpen to ref so parent can call it
  useEffect(() => {
    if (forceOpenRef) {
      forceOpenRef.current = forceOpen;
    }
    return () => {
      if (forceOpenRef) forceOpenRef.current = null;
    };
  }, [forceOpenRef, forceOpen]);

  // Listen for global open event (from floating button, hero CTA, etc.)
  useEffect(() => {
    const handler = () => forceOpen();
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [forceOpen]);

  useEffect(() => {
    const alreadyShown = localStorage.getItem(SESSION_KEY);
    if (alreadyShown) return;

    timerRef.current = setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    localStorage.setItem(SESSION_KEY, "1");
    setTimeout(() => {
      setOpen(false);
      setView("info");
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitState("idle");
    }, 300);
  }, []);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.studentName.trim()) newErrors.studentName = "Required";
    if (!form.fatherName.trim()) newErrors.fatherName = "Required";
    if (!form.village.trim()) newErrors.village = "Required";
    if (!form.admissionClass) newErrors.admissionClass = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const messageText = `New Admission Enquiry\n\nStudent Name: ${form.studentName}\nFather Name: ${form.fatherName}\nVillage: ${form.village}\nAdmission Class: ${form.admissionClass}\nPhone Number: ${form.phone}`;

    // Save to backend (fire and forget – don't block the UX)
    try {
      if (actor) {
        await actor.submitAdmissionEnquiry(
          form.studentName,
          form.fatherName,
          form.village,
          form.admissionClass,
          form.phone,
        );
      }
    } catch {
      // Silent – WhatsApp delivery still works
    }

    // Open WhatsApp directly – no blank page, no redirect
    const waUrl = `https://wa.me/916395297305?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Show success in-place
    setSubmitState("success");

    // Auto-close after 3 seconds
    setTimeout(() => {
      setSubmitState("idle");
      handleClose();
    }, 3000);
  }

  function handleField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) handleClose();
  }

  function handleBackdropKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") handleClose();
  }

  if (!open) return null;

  const goldColor = "oklch(0.78 0.168 85)";
  const goldBright = "oklch(0.88 0.168 85)";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    background: "oklch(0.115 0.028 268)",
    border: "1px solid oklch(0.28 0.052 265 / 0.7)",
    borderRadius: "0.5rem",
    color: "oklch(0.95 0.012 80)",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "oklch(0.62 0.04 265)",
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  };

  const errorStyle: React.CSSProperties = {
    color: "oklch(0.65 0.22 27)",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  };

  return (
    <div
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: visible ? "oklch(0 0 0 / 0.75)" : "oklch(0 0 0 / 0)",
        backdropFilter: visible ? "blur(4px)" : "none",
        WebkitBackdropFilter: visible ? "blur(4px)" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      {/* Popup box */}
      <dialog
        open
        data-ocid="admission.dialog"
        aria-label="Admission Open"
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "1rem",
          background: "oklch(0.155 0.032 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.4)",
          boxShadow:
            "0 0 60px oklch(0.78 0.168 85 / 0.18), 0 32px 64px oklch(0 0 0 / 0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition:
            "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          scrollbarWidth: "thin",
          padding: 0,
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), oklch(0.92 0.19 88), oklch(0.78 0.168 85), transparent)",
            borderRadius: "1rem 1rem 0 0",
          }}
        />

        {/* Close button */}
        <button
          type="button"
          data-ocid="admission.close.button"
          onClick={handleClose}
          aria-label="Close popup"
          style={{
            position: "absolute",
            top: "0.875rem",
            right: "0.875rem",
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            border: "1px solid oklch(0.78 0.168 85 / 0.3)",
            background: "oklch(0.78 0.168 85 / 0.08)",
            color: "oklch(0.62 0.04 265)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = goldColor;
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "oklch(0.78 0.168 85 / 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.62 0.04 265)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "oklch(0.78 0.168 85 / 0.3)";
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* ── View 1: Info ── */}
        {view === "info" && (
          <div style={{ padding: "1.75rem 1.75rem 2rem" }}>
            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <h2
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem, 5vw, 1.875rem)",
                  background:
                    "linear-gradient(120deg, oklch(0.89 0.19 88), oklch(0.78 0.168 85), oklch(0.92 0.15 78), oklch(0.64 0.138 82))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                  marginBottom: "0.5rem",
                }}
              >
                🎓 Admission Open
              </h2>
              <p
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "oklch(0.92 0.015 80)",
                  marginBottom: "0.25rem",
                }}
              >
                R D S Meena Memorial Public School
              </p>
              {/* Gold divider */}
              <div
                style={{
                  height: "1px",
                  width: "80px",
                  margin: "0.75rem auto",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.168 85), transparent)",
                  boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
                }}
              />
            </div>

            {/* Message */}
            <div
              style={{
                textAlign: "center",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: "oklch(0.115 0.028 268)",
                border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                marginBottom: "1.25rem",
              }}
            >
              <p
                style={{
                  color: "oklch(0.82 0.015 80)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  marginBottom: "0.75rem",
                }}
              >
                Admissions are open from{" "}
                <strong style={{ color: goldBright }}>
                  Nursery to Class 8.
                </strong>
              </p>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              <button
                type="button"
                data-ocid="admission.apply.button"
                onClick={() => setView("form")}
                className="btn-gold"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Apply for Admission
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn-gold-outline"
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ── View 2: Form ── */}
        {view === "form" && (
          <div style={{ padding: "1.5rem 1.75rem 2rem" }}>
            {/* Back button + heading */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setView("info");
                  setErrors({});
                }}
                aria-label="Go back"
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                  background: "oklch(0.78 0.168 85 / 0.08)",
                  color: goldColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <h3
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "oklch(0.92 0.015 80)",
                  margin: 0,
                }}
              >
                Admission Enquiry Form
              </h3>
            </div>

            {/* Gold divider */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.168 85 / 0.4), transparent)",
                marginBottom: "1.25rem",
              }}
            />

            <form data-ocid="admission.form" onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {/* Student Name */}
                <div>
                  <label htmlFor="adm-student-name" style={labelStyle}>
                    Student Name
                  </label>
                  <input
                    id="adm-student-name"
                    data-ocid="admission.student_name.input"
                    type="text"
                    placeholder="Enter student's full name"
                    value={form.studentName}
                    onChange={(e) => handleField("studentName", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.studentName ? borderError : undefined,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = borderGold;
                      e.currentTarget.style.boxShadow = focusGold;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.studentName
                        ? borderError
                        : borderNormal;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.studentName && (
                    <p
                      data-ocid="admission.student_name.error_state"
                      style={errorStyle}
                    >
                      {errors.studentName}
                    </p>
                  )}
                </div>

                {/* Father Name */}
                <div>
                  <label htmlFor="adm-father-name" style={labelStyle}>
                    Father Name
                  </label>
                  <input
                    id="adm-father-name"
                    data-ocid="admission.father_name.input"
                    type="text"
                    placeholder="Enter father's full name"
                    value={form.fatherName}
                    onChange={(e) => handleField("fatherName", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.fatherName ? borderError : undefined,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = borderGold;
                      e.currentTarget.style.boxShadow = focusGold;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.fatherName
                        ? borderError
                        : borderNormal;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.fatherName && (
                    <p style={errorStyle}>{errors.fatherName}</p>
                  )}
                </div>

                {/* Village */}
                <div>
                  <label htmlFor="adm-village" style={labelStyle}>
                    Village
                  </label>
                  <input
                    id="adm-village"
                    data-ocid="admission.village.input"
                    type="text"
                    placeholder="Enter village / area"
                    value={form.village}
                    onChange={(e) => handleField("village", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.village ? borderError : undefined,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = borderGold;
                      e.currentTarget.style.boxShadow = focusGold;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.village
                        ? borderError
                        : borderNormal;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.village && <p style={errorStyle}>{errors.village}</p>}
                </div>

                {/* Admission Class */}
                <div>
                  <label htmlFor="adm-class" style={labelStyle}>
                    Admission Class
                  </label>
                  <select
                    id="adm-class"
                    data-ocid="admission.class.select"
                    value={form.admissionClass}
                    onChange={(e) =>
                      handleField("admissionClass", e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      borderColor: errors.admissionClass
                        ? borderError
                        : undefined,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.875rem center",
                      paddingRight: "2.5rem",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = borderGold;
                      e.currentTarget.style.boxShadow = focusGold;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.admissionClass
                        ? borderError
                        : borderNormal;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <option
                      value=""
                      disabled
                      style={{ background: "oklch(0.115 0.028 268)" }}
                    >
                      Select class
                    </option>
                    {CLASSES.map((cls) => (
                      <option
                        key={cls}
                        value={cls}
                        style={{
                          background: "oklch(0.115 0.028 268)",
                          color: "oklch(0.95 0.012 80)",
                        }}
                      >
                        {cls}
                      </option>
                    ))}
                  </select>
                  {errors.admissionClass && (
                    <p style={errorStyle}>{errors.admissionClass}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="adm-phone" style={labelStyle}>
                    Phone Number
                  </label>
                  <input
                    id="adm-phone"
                    data-ocid="admission.phone.input"
                    type="tel"
                    placeholder="Enter contact phone number"
                    value={form.phone}
                    onChange={(e) => handleField("phone", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? borderError : undefined,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = borderGold;
                      e.currentTarget.style.boxShadow = focusGold;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.phone
                        ? borderError
                        : borderNormal;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                </div>

                {/* Success message */}
                {submitState === "success" && (
                  <div
                    data-ocid="admission.success_state"
                    style={{
                      padding: "1rem",
                      borderRadius: "0.625rem",
                      background: "oklch(0.25 0.07 145 / 0.4)",
                      border: "1px solid oklch(0.6 0.15 145 / 0.5)",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "oklch(0.82 0.15 145)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                      }}
                    >
                      ✅ Your admission enquiry has been sent successfully.
                    </p>
                  </div>
                )}

                {/* Submit */}
                {submitState === "idle" && (
                  <button
                    type="submit"
                    data-ocid="admission.submit.button"
                    className="btn-gold"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.625rem",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      cursor: "pointer",
                      border: "none",
                      marginTop: "0.25rem",
                    }}
                  >
                    📤 Submit Admission Enquiry
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </dialog>
    </div>
  );
}
