import {
  AlertCircle,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image,
  Link2,
  Lock,
  Megaphone,
  Plus,
  Search,
  Shield,
  StickyNote,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminDatesheetUpload } from "../components/ExamCornerButton";
import { useActor } from "../hooks/useActor";
import { getAnalytics } from "../lib/firebase";

// ─── Types (shared with TeacherResourcesPage) ─────────────────
type ResourceType =
  | "image"
  | "pdf"
  | "notice"
  | "link"
  | "announcement"
  | "datesheet"
  | "template"
  | "photo";

interface TeacherResource {
  id: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  fileData: string;
  fileName: string;
  externalLink: string;
  textContent: string;
  uploadedAt: bigint;
  category?: string;
}

const ADMIN_SESSION_KEY = "rds-admin-session";

const CATEGORIES = [
  "All",
  "Notices",
  "Exam Formats",
  "Events",
  "Documents",
] as const;
type Category = (typeof CATEGORIES)[number];

// Admin credentials check
const checkAdminPassword = (username: string, password: string): boolean =>
  username === "admin" && password === "Welcomeadmin";

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizeResource(r: unknown): TeacherResource {
  const raw = r as Record<string, unknown>;
  const rawTs =
    typeof raw.uploadedAt === "bigint"
      ? raw.uploadedAt
      : BigInt(Math.floor(Number(raw.uploadedAt ?? 0)));
  const uploadedAt = rawTs > 10_000_000_000n ? rawTs : rawTs * 1000n;
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    resourceType: String(raw.resourceType ?? "notice") as ResourceType,
    fileData: String(raw.fileData ?? ""),
    fileName: String(raw.fileName ?? ""),
    externalLink: String(raw.externalLink ?? ""),
    textContent: String(raw.textContent ?? ""),
    uploadedAt,
    category: String(raw.category ?? ""),
  };
}

function matchesCategory(
  resource: TeacherResource,
  category: Category,
): boolean {
  if (category === "All") return true;
  if (resource.category === category) return true;
  switch (category) {
    case "Notices":
      return (
        resource.resourceType === "notice" ||
        resource.resourceType === "announcement"
      );
    case "Exam Formats":
      return (
        resource.resourceType === "template" || resource.resourceType === "pdf"
      );
    case "Events":
      return (
        resource.resourceType === "datesheet" ||
        resource.resourceType === "announcement"
      );
    case "Documents":
      return (
        resource.resourceType === "pdf" ||
        resource.resourceType === "image" ||
        resource.resourceType === "photo" ||
        resource.resourceType === "link" ||
        resource.resourceType === "template"
      );
    default:
      return false;
  }
}

const BADGE_CONFIG: Record<
  ResourceType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  image: {
    label: "Image",
    color: "oklch(0.55 0.12 150)",
    icon: <Image className="w-3 h-3" />,
  },
  photo: {
    label: "Photo",
    color: "oklch(0.52 0.11 165)",
    icon: <Image className="w-3 h-3" />,
  },
  pdf: {
    label: "PDF",
    color: "oklch(0.52 0.15 25)",
    icon: <FileText className="w-3 h-3" />,
  },
  template: {
    label: "Template",
    color: "oklch(0.50 0.13 295)",
    icon: <BookOpen className="w-3 h-3" />,
  },
  notice: {
    label: "Notice",
    color: "oklch(0.58 0.14 55)",
    icon: <StickyNote className="w-3 h-3" />,
  },
  announcement: {
    label: "Announcement",
    color: "oklch(0.55 0.16 35)",
    icon: <Megaphone className="w-3 h-3" />,
  },
  datesheet: {
    label: "Datesheet",
    color: "oklch(0.52 0.12 220)",
    icon: <Calendar className="w-3 h-3" />,
  },
  link: {
    label: "Link",
    color: "oklch(0.54 0.13 265)",
    icon: <Link2 className="w-3 h-3" />,
  },
};

// ─── Lightbox ─────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: click to close overlay
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.88)" }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full"
        style={{
          background: "oklch(0.78 0.168 85 / 0.15)",
          border: "1px solid oklch(0.78 0.168 85 / 0.4)",
          color: "oklch(0.88 0.168 85)",
        }}
        aria-label="Close preview"
      >
        <X className="w-5 h-5" />
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <img
        src={src}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] rounded-xl"
        style={{ objectFit: "contain" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─── Resource Card (Admin version with delete) ─────────────────
function AdminResourceCard({
  resource,
  onDelete,
}: {
  resource: TeacherResource;
  onDelete: (id: string) => void;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const badge = BADGE_CONFIG[resource.resourceType];
  const isImage =
    resource.resourceType === "image" || resource.resourceType === "photo";
  const isPdf =
    resource.resourceType === "pdf" || resource.resourceType === "template";
  const isLink = resource.resourceType === "link";
  const isText =
    resource.resourceType === "notice" ||
    resource.resourceType === "announcement" ||
    resource.resourceType === "datesheet";

  const handleDownload = () => {
    if (!resource.fileData) return;
    const a = document.createElement("a");
    a.href = resource.fileData;
    a.download = resource.fileName || "download";
    a.click();
  };

  const handlePdfPreview = () => {
    if (!resource.fileData) return;
    window.open(resource.fileData, "_blank");
  };

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
      <div
        className="relative rounded-xl overflow-hidden flex flex-col"
        style={{
          background: "oklch(0.240 0.040 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.20)",
        }}
      >
        {isImage && resource.fileData && (
          <button
            type="button"
            className="w-full cursor-zoom-in overflow-hidden"
            style={{ height: "160px" }}
            onClick={() => setLightboxSrc(resource.fileData)}
            aria-label={`Preview ${resource.title}`}
          >
            <img
              src={resource.fileData}
              alt={resource.title}
              className="w-full h-full"
              style={{ objectFit: "cover" }}
            />
          </button>
        )}
        {isPdf && resource.fileData && (
          <div
            className="flex items-center justify-center"
            style={{
              height: "100px",
              background: "oklch(0.78 0.168 85 / 0.05)",
            }}
          >
            <div
              className="flex flex-col items-center gap-1"
              style={{ color: "oklch(0.78 0.168 85 / 0.7)" }}
            >
              <FileText className="w-8 h-8" />
              <span className="text-xs font-body truncate max-w-[100px]">
                {resource.fileName || "document.pdf"}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-start justify-between gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-body"
              style={{
                background: `${badge.color}22`,
                color: badge.color,
                border: `1px solid ${badge.color}55`,
              }}
            >
              {badge.icon}
              {badge.label}
            </span>
            <button
              type="button"
              onClick={() => onDelete(resource.id)}
              className="p-1 rounded-lg transition-all hover:scale-110 shrink-0"
              style={{
                color: "oklch(0.55 0.18 25)",
                background: "oklch(0.55 0.18 25 / 0.1)",
              }}
              aria-label={`Delete ${resource.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <h3
            className="font-display font-bold text-base leading-snug"
            style={{ color: "oklch(0.88 0.168 85)" }}
          >
            {resource.title}
          </h3>
          {resource.description && (
            <p
              className="font-body text-xs leading-relaxed line-clamp-2"
              style={{ color: "oklch(0.78 0.04 265)" }}
            >
              {resource.description}
            </p>
          )}
          {isText && resource.textContent && (
            <div
              className="rounded-lg p-2 text-xs font-body leading-relaxed whitespace-pre-wrap"
              style={{
                background: "oklch(0.78 0.168 85 / 0.05)",
                border: "1px solid oklch(0.78 0.168 85 / 0.12)",
                color: "oklch(0.85 0.018 80)",
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {resource.textContent}
            </div>
          )}
          <div className="flex-1" />
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.60 0.04 265)" }}
          >
            {formatDate(resource.uploadedAt)}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {isImage && resource.fileData && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxSrc(resource.fileData)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.1)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body"
                  style={{
                    background: "oklch(0.78 0.168 85)",
                    color: "oklch(0.15 0.04 265)",
                  }}
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </>
            )}
            {isPdf && resource.fileData && (
              <>
                <button
                  type="button"
                  onClick={handlePdfPreview}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.1)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body"
                  style={{
                    background: "oklch(0.78 0.168 85)",
                    color: "oklch(0.15 0.04 265)",
                  }}
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </>
            )}
            {isLink && resource.externalLink && (
              <a
                href={resource.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-body"
                style={{
                  background: "oklch(0.78 0.168 85)",
                  color: "oklch(0.15 0.04 265)",
                  textDecoration: "none",
                }}
              >
                <ExternalLink className="w-3 h-3" /> Open Link
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Admin Upload Panel ────────────────────────────────────────
function AdminUploadPanel({
  onAdd,
}: { onAdd: (resource: TeacherResource) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("notice");
  const [category, setCategory] = useState<string>("Notices");
  const [textContent, setTextContent] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFileBased =
    resourceType === "image" ||
    resourceType === "photo" ||
    resourceType === "pdf" ||
    resourceType === "template";
  const isTextBased =
    resourceType === "notice" ||
    resourceType === "announcement" ||
    resourceType === "datesheet";
  const isLinkBased = resourceType === "link";

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);
      if (resourceType === "image" || resourceType === "photo") {
        setPreviewSrc(URL.createObjectURL(file));
      } else {
        setPreviewSrc(null);
      }
    },
    [resourceType],
  );

  const handleTypeChange = (type: ResourceType) => {
    setResourceType(type);
    setSelectedFile(null);
    setPreviewSrc(null);
    setTextContent("");
    setExternalLink("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (isFileBased && !selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    if (isLinkBased && !externalLink.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      let fileData = "";
      let fileName = "";
      if (isFileBased && selectedFile) {
        fileData = await readFileAsBase64(selectedFile);
        fileName = selectedFile.name;
      }

      const newResource: TeacherResource = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: title.trim(),
        description: description.trim(),
        resourceType,
        category,
        fileData,
        fileName,
        externalLink: externalLink.trim(),
        textContent: textContent.trim(),
        uploadedAt: BigInt(Date.now()),
      };

      await onAdd(newResource);
      setSuccessMsg(`"${newResource.title}" added successfully!`);
      setTimeout(() => setSuccessMsg(""), 4000);

      setTitle("");
      setDescription("");
      setCategory("Notices");
      setTextContent("");
      setExternalLink("");
      setSelectedFile(null);
      setPreviewSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Failed to process file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.9rem",
    borderRadius: "0.5rem",
    background: "oklch(0.20 0.038 268)",
    border: "1px solid oklch(0.78 0.168 85 / 0.25)",
    color: "oklch(0.92 0.010 80)",
    fontSize: "0.875rem",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    outline: "none",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden mb-10"
      style={{
        background: "oklch(0.240 0.040 265)",
        border: "1px solid oklch(0.78 0.168 85 / 0.35)",
        boxShadow:
          "0 0 60px oklch(0.78 0.168 85 / 0.08), 0 20px 40px oklch(0 0 0 / 0.3)",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.18), oklch(0.78 0.168 85 / 0.08))",
          borderBottom: "1px solid oklch(0.78 0.168 85 / 0.25)",
        }}
      >
        <Plus className="w-5 h-5" style={{ color: "oklch(0.88 0.168 85)" }} />
        <h2
          className="font-display font-bold text-xl"
          style={{ color: "oklch(0.92 0.168 85)" }}
        >
          Add New Resource
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="ap-title"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Title *
          </label>
          <input
            id="ap-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Exam Paper Format – Class 8 Science"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="ap-desc"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Short Description
          </label>
          <textarea
            id="ap-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ap-type"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Resource Type *
          </label>
          <select
            id="ap-type"
            value={resourceType}
            onChange={(e) => handleTypeChange(e.target.value as ResourceType)}
            style={inputStyle}
          >
            <option value="notice">Notice</option>
            <option value="announcement">Announcement</option>
            <option value="datesheet">Datesheet</option>
            <option value="image">Image</option>
            <option value="photo">Photo</option>
            <option value="pdf">PDF Document</option>
            <option value="template">Exam Template (PDF)</option>
            <option value="link">External Link</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ap-category"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Category
          </label>
          <select
            id="ap-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="Notices">Notices</option>
            <option value="Exam Formats">Exam Formats</option>
            <option value="Events">Events</option>
            <option value="Documents">Documents</option>
          </select>
        </div>

        {isFileBased && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="ap-file"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              {resourceType === "pdf" || resourceType === "template"
                ? "PDF File *"
                : "Image File *"}
            </label>
            <label
              htmlFor="ap-file"
              className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-body font-medium"
              style={{
                background: "oklch(0.78 0.168 85 / 0.08)",
                border: "1.5px dashed oklch(0.78 0.168 85 / 0.35)",
                color: "oklch(0.82 0.04 265)",
              }}
            >
              <Upload
                className="w-4 h-4 shrink-0"
                style={{ color: "oklch(0.78 0.168 85)" }}
              />
              {selectedFile ? selectedFile.name : "Click to select file..."}
              <input
                id="ap-file"
                ref={fileInputRef}
                type="file"
                accept={
                  resourceType === "pdf" || resourceType === "template"
                    ? ".pdf,application/pdf"
                    : "image/*"
                }
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Preview"
                className="mt-2 rounded-lg"
                style={{
                  maxHeight: "120px",
                  objectFit: "contain",
                  border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                }}
              />
            )}
          </div>
        )}

        {isLinkBased && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="ap-url"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              URL / Link *
            </label>
            <input
              id="ap-url"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
        )}

        {isTextBased && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label
              htmlFor="ap-content"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Content / Notice Text
            </label>
            <textarea
              id="ap-content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter the full notice, announcement, or datesheet text here..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        )}

        {error && (
          <div
            className="md:col-span-2 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-body"
            style={{
              background: "oklch(0.52 0.15 25 / 0.12)",
              border: "1px solid oklch(0.52 0.15 25 / 0.3)",
              color: "oklch(0.75 0.12 25)",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div
            className="md:col-span-2 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-body"
            style={{
              background: "oklch(0.45 0.14 150 / 0.15)",
              border: "1px solid oklch(0.55 0.14 150 / 0.35)",
              color: "oklch(0.75 0.14 150)",
            }}
          >
            ✓ {successMsg}
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold font-body text-sm transition-all hover:scale-105 disabled:opacity-60"
            style={{
              background: "oklch(0.78 0.168 85)",
              color: "oklch(0.15 0.04 265)",
              boxShadow: "0 2px 16px oklch(0.78 0.168 85 / 0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? "Adding..." : "Add Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Admin Login Gate ──────────────────────────────────────────
function AdminLoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(username, password)) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      onUnlock();
    } else {
      setError("Incorrect username or password");
      setPassword("");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.625rem",
    background: "oklch(0.20 0.038 268)",
    border: error
      ? "1px solid oklch(0.52 0.15 25 / 0.7)"
      : "1px solid oklch(0.78 0.168 85 / 0.25)",
    color: "oklch(0.92 0.010 80)",
    fontSize: "0.9rem",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    outline: "none",
  };

  return (
    <div
      className="min-h-full flex items-center justify-center px-4 py-16"
      style={{ background: "oklch(0.185 0.035 268)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.240 0.040 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.30)",
          boxShadow:
            "0 0 80px oklch(0.78 0.168 85 / 0.10), 0 30px 60px oklch(0 0 0 / 0.4)",
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.3), oklch(0.88 0.168 85), oklch(0.78 0.168 85 / 0.3))",
          }}
        />
        <div className="px-8 py-10 flex flex-col items-center gap-6">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.15), oklch(0.78 0.168 85 / 0.05))",
              border: "2px solid oklch(0.78 0.168 85 / 0.35)",
            }}
          >
            <Shield
              className="w-8 h-8"
              style={{ color: "oklch(0.78 0.168 85)" }}
            />
          </div>

          <div className="text-center">
            <h1
              className="font-display font-bold text-2xl mb-1"
              style={{ color: "oklch(0.92 0.168 85)" }}
            >
              Admin Panel
            </h1>
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.62 0.04 265)" }}
            >
              Restricted access — authorized administrators only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-username"
                className="text-xs font-semibold font-body uppercase tracking-wider"
                style={{ color: "oklch(0.78 0.168 85)" }}
              >
                Username
              </label>
              <input
                id="admin-username"
                ref={usernameRef}
                type="text"
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username..."
                style={{
                  ...inputStyle,
                  border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-password"
                className="text-xs font-semibold font-body uppercase tracking-wider"
                style={{ color: "oklch(0.78 0.168 85)" }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password..."
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-body"
                style={{
                  background: "oklch(0.52 0.15 25 / 0.12)",
                  border: "1px solid oklch(0.52 0.15 25 / 0.3)",
                  color: "oklch(0.75 0.12 25)",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username || !password}
              className="w-full py-3 rounded-xl font-semibold font-body text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: "oklch(0.78 0.168 85)",
                color: "oklch(0.15 0.04 265)",
                boxShadow: "0 2px 20px oklch(0.78 0.168 85 / 0.35)",
              }}
            >
              Login to Admin Panel
            </button>
          </form>

          <p
            className="font-body text-xs text-center"
            style={{ color: "oklch(0.42 0.04 265)" }}
          >
            This page is for administrators only.
            <br />
            Do not share this URL with teachers or students.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── localStorage helpers (shared key with TeacherResourcesPage) ─
const LS_RESOURCES_KEY = "rds-teacher-resources";

function saveResourcesToStorage(resources: TeacherResource[]) {
  try {
    const serialized = resources.map((r) => ({
      ...r,
      uploadedAt: r.uploadedAt.toString(),
    }));
    localStorage.setItem(LS_RESOURCES_KEY, JSON.stringify(serialized));
  } catch {
    /* ignore quota errors */
  }
}

function loadResourcesFromStorage(): TeacherResource[] {
  try {
    const raw = localStorage.getItem(LS_RESOURCES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((r: Record<string, unknown>) => ({
      ...r,
      uploadedAt: BigInt(String(r.uploadedAt ?? "0")),
    })) as TeacherResource[];
  } catch {
    return [];
  }
}

// ─── Admin Dashboard ───────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { actor, isFetching: actorFetching } = useActor();

  // Load from localStorage immediately so resources appear without waiting for actor.
  const [resources, setResources] = useState<TeacherResource[]>(() =>
    loadResourcesFromStorage(),
  );
  const [isLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    likes: number;
    visitors: number;
  } | null>(null);

  // Load Firebase analytics for admin view
  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch(() => {});
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // Background sync from backend — merge into localStorage if backend has items.
  useEffect(() => {
    if (actorFetching || !actor) return;
    actor
      .getAllTeacherResources()
      .then((res) => {
        const normalized = (res as unknown[]).map(normalizeResource);
        if (normalized.length > 0) {
          setResources(normalized);
          saveResourcesToStorage(normalized);
        }
      })
      .catch(() => {
        // silently ignore — localStorage data already shown
      });
  }, [actor, actorFetching]);

  const handleAddResource = async (
    resource: TeacherResource,
  ): Promise<void> => {
    // 1. Save to localStorage and update UI immediately.
    const updated = [resource, ...resources];
    setResources(updated);
    saveResourcesToStorage(updated);

    // 2. Background sync to backend — ignore failures.
    if (actor) {
      try {
        await actor.addTeacherResource(
          resource.title,
          resource.description,
          resource.resourceType,
          resource.fileData,
          resource.fileName,
          resource.externalLink,
          resource.textContent,
          resource.category ?? "",
        );
      } catch {
        // silently ignore
      }
    }
  };

  const handleDeleteResource = async (id: string) => {
    // 1. Remove from localStorage and update UI immediately.
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    saveResourcesToStorage(updated);

    // 2. Background sync to backend — ignore failures.
    if (actor) {
      try {
        await actor.deleteTeacherResource(id);
      } catch {
        // silently ignore
      }
    }
  };

  const filteredResources = resources.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchesSearch && matchesCategory(r, activeCategory);
  });

  return (
    <div
      className="min-h-full"
      style={{ background: "oklch(0.185 0.035 268)" }}
    >
      {/* Header */}
      <div
        className="relative py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.05 265) 0%, oklch(0.185 0.035 268) 100%)",
          borderBottom: "1px solid oklch(0.36 0.052 265 / 0.5)",
        }}
      >
        <div className="mx-auto max-w-7xl flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield
                className="w-5 h-5"
                style={{ color: "oklch(0.78 0.168 85)" }}
              />
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold font-body"
                style={{ color: "oklch(0.78 0.168 85)" }}
              >
                Admin Panel
              </p>
            </div>
            <h1
              className="font-display font-bold text-3xl sm:text-4xl"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              Teacher Resources{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.88 0.168 85), oklch(0.72 0.168 85))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Management
              </span>
            </h1>
            <p
              className="font-body text-sm mt-2"
              style={{ color: "oklch(0.62 0.04 265)" }}
            >
              Upload, manage, and delete resources visible to teachers.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all"
            style={{
              background: "oklch(0.52 0.15 25 / 0.12)",
              border: "1px solid oklch(0.52 0.15 25 / 0.3)",
              color: "oklch(0.75 0.12 25)",
            }}
          >
            <Lock className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Analytics Stats */}
          {analytics && (
            <div
              className="mb-8 p-5 rounded-xl flex gap-8 items-center"
              style={{
                background: "oklch(0.20 0.04 265)",
                border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                boxShadow: "0 2px 12px oklch(0 0 0 / 0.3)",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-3xl font-bold font-display"
                  style={{ color: "oklch(0.88 0.168 85)" }}
                >
                  {analytics.likes}
                </span>
                <span
                  className="text-xs font-body uppercase tracking-widest"
                  style={{ color: "oklch(0.62 0.04 265)" }}
                >
                  Total Likes ❤️
                </span>
              </div>
              <div
                className="w-px self-stretch"
                style={{ background: "oklch(0.78 0.168 85 / 0.2)" }}
              />
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-3xl font-bold font-display"
                  style={{ color: "oklch(0.88 0.168 85)" }}
                >
                  {analytics.visitors}
                </span>
                <span
                  className="text-xs font-body uppercase tracking-widest"
                  style={{ color: "oklch(0.62 0.04 265)" }}
                >
                  Total Visitors 👁️
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  getAnalytics()
                    .then(setAnalytics)
                    .catch(() => {})
                }
                className="ml-auto text-xs px-3 py-1.5 rounded-lg font-body"
                style={{
                  background: "oklch(0.78 0.168 85 / 0.12)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                  color: "oklch(0.78 0.168 85)",
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>
          )}
          {/* Datesheet upload */}
          <AdminDatesheetUpload />
          {/* Upload panel */}
          <AdminUploadPanel onAdd={handleAddResource} />

          {/* Resources section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.92 0.168 85)" }}
              >
                Uploaded Resources ({resources.length})
              </h2>
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "oklch(0.62 0.04 265)" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  style={{
                    width: "100%",
                    padding: "0.6rem 1rem 0.6rem 2.25rem",
                    borderRadius: "0.625rem",
                    background: "oklch(0.20 0.038 268)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.22)",
                    color: "oklch(0.92 0.010 80)",
                    fontSize: "0.875rem",
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-sm font-body font-semibold transition-all"
                    style={
                      isActive
                        ? {
                            background: "oklch(0.78 0.168 85)",
                            color: "oklch(0.15 0.04 265)",
                            border: "1px solid oklch(0.78 0.168 85)",
                          }
                        : {
                            background: "oklch(0.78 0.168 85 / 0.06)",
                            color: "oklch(0.72 0.04 265)",
                            border: "1px solid oklch(0.78 0.168 85 / 0.22)",
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <BookOpen
                  className="w-12 h-12 mx-auto mb-4 animate-pulse"
                  style={{ color: "oklch(0.78 0.168 85 / 0.6)" }}
                />
                <p
                  className="font-body text-sm"
                  style={{ color: "oklch(0.72 0.04 265)" }}
                >
                  Loading resources...
                </p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "oklch(0.78 0.168 85 / 0.4)" }}
                />
                <h3
                  className="font-display font-semibold text-xl mb-2"
                  style={{ color: "oklch(0.72 0.04 265)" }}
                >
                  No resources yet
                </h3>
                <p
                  className="font-body text-sm"
                  style={{ color: "oklch(0.55 0.04 265)" }}
                >
                  Use the form above to add your first resource.
                </p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className="font-body text-sm"
                  style={{ color: "oklch(0.55 0.04 265)" }}
                >
                  No resources match your search or filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredResources.map((resource) => (
                  <AdminResourceCard
                    key={resource.id}
                    resource={resource}
                    onDelete={handleDeleteResource}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Panel Page ─────────────────────────────────────
// Accessible only via the hidden /admin-panel route.
// NOT linked anywhere in the public navbar, footer, or any visible UI.
// Renders as a fixed full-screen overlay so the school layout (navbar/footer)
// is completely hidden from the admin interface.
export function AdminPanelPage() {
  // Always start unauthenticated — no session persistence so login is required
  // on every visit for security.
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const handleUnlock = () => {
    setAuthenticated(true);
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    // Fixed full-screen overlay — covers the school navbar and layout entirely
    <div
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: "oklch(0.185 0.035 268)" }}
    >
      {authenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLoginGate onUnlock={handleUnlock} />
      )}
    </div>
  );
}
