import { Clock, Download, FileText, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface DatesheetInfo {
  fileName: string;
  dataUrl: string; // base64 data URL or public URL
  uploadedAt: string;
  isStatic?: boolean; // true if using the built-in static image
}

const DATESHEET_KEY = "rds-exam-datesheet";

// Built-in static datesheet image (uploaded by admin)
const STATIC_DATESHEET: DatesheetInfo = {
  fileName: "Exam-Datesheet.jpeg",
  dataUrl: "/assets/uploads/WhatsApp-Image-2026-03-11-at-11.36.42-PM-1.jpeg",
  uploadedAt: new Date().toISOString(),
  isStatic: true,
};

function loadDatesheet(): DatesheetInfo {
  try {
    const raw = localStorage.getItem(DATESHEET_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DatesheetInfo;
      // If there's an admin-uploaded one, use it; otherwise fall back to static
      if (parsed?.dataUrl) return parsed;
    }
  } catch {
    // ignore
  }
  return STATIC_DATESHEET;
}

function saveDatesheet(info: DatesheetInfo) {
  localStorage.setItem(DATESHEET_KEY, JSON.stringify(info));
}

// Download helper — works for both data URLs and public paths
async function downloadFile(dataUrl: string, fileName: string) {
  try {
    if (dataUrl.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      a.click();
    } else {
      // Fetch the static asset and trigger download
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch {
    // Fallback: open in new tab
    window.open(dataUrl, "_blank");
  }
}

// ── ExamCornerButton (public-facing) ────────────────────────────────────────
export function ExamCornerButton() {
  const [open, setOpen] = useState(false);
  const [datesheet, setDatesheet] = useState<DatesheetInfo>(STATIC_DATESHEET);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDatesheet(loadDatesheet());
  }, []);

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

  function handleDownload() {
    downloadFile(datesheet.dataUrl, datesheet.fileName);
  }

  const isImage =
    datesheet.dataUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ||
    datesheet.dataUrl.startsWith("data:image");

  return (
    <div ref={panelRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        data-ocid="exam.corner.button"
        onClick={() => {
          setDatesheet(loadDatesheet());
          setOpen((v) => !v);
        }}
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
              width: "min(360px, 90vw)",
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
              <div className="space-y-3 mb-4">
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

              {/* Datesheet image preview */}
              {isImage && (
                <div
                  className="mb-4 rounded-xl overflow-hidden"
                  style={{
                    border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                    background: "oklch(0.12 0.03 260)",
                  }}
                >
                  <img
                    src={datesheet.dataUrl}
                    alt="Exam Datesheet"
                    data-ocid="exam.datesheet.card"
                    className="w-full object-contain"
                    style={{ maxHeight: "240px" }}
                  />
                </div>
              )}

              {/* Download button */}
              <button
                type="button"
                data-ocid="exam.datesheet.button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.168 85), oklch(0.72 0.168 85))",
                  color: "oklch(0.12 0.03 260)",
                }}
              >
                <Download size={16} />
                Download Datesheet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── AdminDatesheetUpload (admin panel only) ──────────────────────────────────
export function AdminDatesheetUpload() {
  const [datesheet, setDatesheet] = useState<DatesheetInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(DATESHEET_KEY);
    if (stored) {
      try {
        setDatesheet(JSON.parse(stored));
      } catch {
        setDatesheet(STATIC_DATESHEET);
      }
    } else {
      setDatesheet(STATIC_DATESHEET);
    }
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const info: DatesheetInfo = {
        fileName: file.name,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
        isStatic: false,
      };
      saveDatesheet(info);
      setDatesheet(info);
      setUploading(false);
      setSuccessMsg("Datesheet uploaded successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="mb-10 rounded-2xl p-6"
      style={{
        background: "oklch(0.18 0.04 260)",
        border: "1px solid oklch(0.78 0.168 85 / 0.3)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FileText size={20} style={{ color: "oklch(0.78 0.168 85)" }} />
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.92 0.168 85)" }}
        >
          Exam Corner — Datesheet
        </h3>
      </div>

      {datesheet && (
        <div
          className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "oklch(0.22 0.05 260)" }}
        >
          <FileText size={16} style={{ color: "oklch(0.78 0.168 85)" }} />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "oklch(0.93 0.02 260)" }}
            >
              {datesheet.fileName}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.04 260)" }}>
              {datesheet.isStatic
                ? "Default datesheet (built-in)"
                : `Uploaded: ${new Date(datesheet.uploadedAt).toLocaleString()}`}
            </p>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              background: "oklch(0.65 0.168 85 / 0.2)",
              color: "oklch(0.78 0.168 85)",
            }}
          >
            Active
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFile}
        data-ocid="exam.datesheet.upload_button"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.168 85), oklch(0.72 0.168 85))",
          color: "oklch(0.12 0.03 260)",
        }}
      >
        <Upload size={16} />
        {uploading
          ? "Uploading..."
          : datesheet && !datesheet.isStatic
            ? "Replace Datesheet"
            : "Upload New Datesheet"}
      </button>

      {successMsg && (
        <p
          data-ocid="exam.datesheet.success_state"
          className="mt-3 text-sm"
          style={{ color: "oklch(0.7 0.2 145)" }}
        >
          ✓ {successMsg}
        </p>
      )}

      <p className="mt-3 text-xs" style={{ color: "oklch(0.5 0.04 260)" }}>
        Accepted formats: PDF, DOC, DOCX, JPG, PNG. Once uploaded, the new file
        replaces the default datesheet.
      </p>
    </div>
  );
}
