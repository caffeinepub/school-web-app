import { Clock, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── ExamCornerButton (public-facing) ────────────────────────────────────────
export function ExamCornerButton() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        data-ocid="exam.corner.button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.28 0.06 260), oklch(0.22 0.05 255))",
          color: "oklch(0.92 0.168 85)",
          border: "1px solid oklch(0.78 0.168 85 / 0.4)",
          boxShadow:
            "0 4px 20px oklch(0.78 0.168 85 / 0.3), 0 2px 8px oklch(0 0 0 / 0.4)",
        }}
      >
        <FileText size={16} />📋 Exam Corner
      </button>

      {/* Popup panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="exam.corner.panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 rounded-2xl shadow-2xl"
            style={{
              background: "oklch(0.16 0.04 260)",
              border: "1px solid oklch(0.78 0.168 85 / 0.35)",
              boxShadow:
                "0 20px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.78 0.168 85 / 0.15)",
              width: "min(320px, 90vw)",
            }}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-display font-bold text-base"
                  style={{ color: "oklch(0.92 0.168 85)" }}
                >
                  📋 Exam Corner
                </h3>
                <button
                  type="button"
                  data-ocid="exam.corner.close_button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 transition-colors hover:bg-white/10"
                  style={{ color: "oklch(0.7 0.05 260)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Timings */}
              <div className="space-y-3 mb-5">
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "oklch(0.22 0.05 260)" }}
                >
                  <Clock size={16} style={{ color: "oklch(0.78 0.168 85)" }} />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.04 260)" }}
                    >
                      School Time
                    </p>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "oklch(0.93 0.02 260)" }}
                    >
                      09:00 AM
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "oklch(0.22 0.05 260)" }}
                >
                  <Clock size={16} style={{ color: "oklch(0.78 0.168 85)" }} />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.04 260)" }}
                    >
                      Paper Timing
                    </p>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "oklch(0.93 0.02 260)" }}
                    >
                      09:30 AM
                    </p>
                  </div>
                </div>
              </div>

              {/* Datesheet message */}
              <div
                className="rounded-xl px-4 py-4 text-center"
                style={{
                  background: "oklch(0.22 0.05 260)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.18)",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.80 0.04 260)" }}
                >
                  Exams coming soon. Datesheet will be available here.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── AdminDatesheetUpload (admin panel only) ──────────────────────────────────
// Kept for admin panel compatibility — no longer used in popup display
export function AdminDatesheetUpload() {
  return (
    <div
      className="mb-10 rounded-2xl p-6"
      style={{
        background: "oklch(0.18 0.04 260)",
        border: "1px solid oklch(0.78 0.168 85 / 0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <FileText size={20} style={{ color: "oklch(0.78 0.168 85)" }} />
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.92 0.168 85)" }}
        >
          Exam Corner — Datesheet
        </h3>
      </div>
      <p className="mt-3 text-sm" style={{ color: "oklch(0.65 0.04 260)" }}>
        The Exam Corner popup currently shows: &ldquo;Exams coming soon.
        Datesheet will be available here.&rdquo;
      </p>
    </div>
  );
}
