import {
  AlertCircle,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
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
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────
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
  fileData: string; // base64 data URL for images/PDFs, or ''
  fileName: string; // original filename
  externalLink: string; // for link type
  textContent: string; // for notice/announcement/datesheet text
  uploadedAt: bigint; // timestamp (bigint from backend)
  category?: string; // display category: "Notices" | "Exam Formats" | "Events" | "Documents"
}

// ─── Constants ────────────────────────────────────────────────
// NOTE: No sessionStorage keys for unlock state — password is always required on
// every page visit and every page reload. This is intentional.

const CATEGORIES = [
  "All",
  "Notices",
  "Exam Formats",
  "Events",
  "Documents",
] as const;
type Category = (typeof CATEGORIES)[number];

// Password comparison — teacher password is case-insensitive
const checkMainPassword = (input: string): boolean =>
  input.toLowerCase() === ["welcome", "teachers"].join("");

// Admin credentials: username === "admin" (exact), password === "Welcomeadmin" (exact)
const checkAdminPassword = (username: string, password: string): boolean =>
  username === "admin" && password === "Welcomeadmin";

// ─── Helpers ──────────────────────────────────────────────────
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

// ─── Category filter logic ────────────────────────────────────
function matchesCategory(
  resource: TeacherResource,
  category: Category,
): boolean {
  if (category === "All") return true;

  // Explicit category field takes priority
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

// ─── Badge config ─────────────────────────────────────────────
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
      data-ocid="teacher-resources.modal"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.88)" }}
      onClick={onClose}
    >
      <button
        type="button"
        data-ocid="teacher-resources.close_button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full transition-all"
        style={{
          background: "oklch(0.78 0.168 85 / 0.15)",
          border: "1px solid oklch(0.78 0.168 85 / 0.4)",
          color: "oklch(0.88 0.168 85)",
        }}
        aria-label="Close preview"
      >
        <X className="w-5 h-5" />
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation on image click */}
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

// ─── Resource Card ────────────────────────────────────────────
function ResourceCard({
  resource,
  adminMode,
  onDelete,
}: {
  resource: TeacherResource;
  adminMode: boolean;
  onDelete: (id: string) => void;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const badge = BADGE_CONFIG[resource.resourceType];

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

  const isImage =
    resource.resourceType === "image" || resource.resourceType === "photo";
  const isPdf =
    resource.resourceType === "pdf" || resource.resourceType === "template";
  const isLink = resource.resourceType === "link";
  const isText =
    resource.resourceType === "notice" ||
    resource.resourceType === "announcement" ||
    resource.resourceType === "datesheet";

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
      <div
        data-ocid="teacher-resources.card"
        className="relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
        style={{
          background: "oklch(0.240 0.040 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.20)",
          boxShadow:
            "0 4px 24px oklch(0 0 0 / 0.25), 0 0 0 0 oklch(0.78 0.168 85 / 0)",
        }}
      >
        {/* Image preview strip */}
        {isImage && resource.fileData && (
          <button
            type="button"
            data-ocid="teacher-resources.canvas_target"
            className="w-full cursor-zoom-in overflow-hidden"
            style={{ height: "180px" }}
            onClick={() => setLightboxSrc(resource.fileData)}
            aria-label={`Preview ${resource.title}`}
          >
            <img
              src={resource.fileData}
              alt={resource.title}
              className="w-full h-full transition-transform duration-300 hover:scale-105"
              style={{ objectFit: "cover" }}
            />
          </button>
        )}

        {/* PDF icon strip */}
        {isPdf && resource.fileData && (
          <div
            className="flex items-center justify-center"
            style={{
              height: "120px",
              background: "oklch(0.78 0.168 85 / 0.05)",
              borderBottom: "1px solid oklch(0.78 0.168 85 / 0.12)",
            }}
          >
            <div
              className="flex flex-col items-center gap-1"
              style={{ color: "oklch(0.78 0.168 85 / 0.7)" }}
            >
              <FileText className="w-10 h-10" />
              <span className="text-xs font-body truncate max-w-[120px]">
                {resource.fileName || "document.pdf"}
              </span>
            </div>
          </div>
        )}

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Badge + delete row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
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
              {resource.category && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-body"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.08)",
                    color: "oklch(0.78 0.168 85 / 0.7)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                  }}
                >
                  {resource.category}
                </span>
              )}
            </div>
            {adminMode && (
              <button
                type="button"
                data-ocid="teacher-resources.delete_button"
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
            )}
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-lg leading-snug"
            style={{ color: "oklch(0.88 0.168 85)" }}
          >
            {resource.title}
          </h3>

          {/* Description */}
          {resource.description && (
            <p
              className="font-body text-sm leading-relaxed line-clamp-2"
              style={{ color: "oklch(0.78 0.04 265)" }}
            >
              {resource.description}
            </p>
          )}

          {/* Text content for notice/announcement/datesheet */}
          {isText && resource.textContent && (
            <div
              className="rounded-lg p-3 text-sm font-body leading-relaxed whitespace-pre-wrap"
              style={{
                background: "oklch(0.78 0.168 85 / 0.05)",
                border: "1px solid oklch(0.78 0.168 85 / 0.12)",
                color: "oklch(0.85 0.018 80)",
                maxHeight: "140px",
                overflowY: "auto",
              }}
            >
              {resource.textContent}
            </div>
          )}

          {/* Spacer to push footer down */}
          <div className="flex-1" />

          {/* Date */}
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.60 0.04 265)" }}
          >
            {formatDate(resource.uploadedAt)}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isImage && resource.fileData && (
              <>
                <button
                  type="button"
                  data-ocid="teacher-resources.secondary_button"
                  onClick={() => setLightboxSrc(resource.fileData)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.1)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  type="button"
                  data-ocid="teacher-resources.primary_button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.78 0.168 85)",
                    color: "oklch(0.15 0.04 265)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </>
            )}

            {isPdf && resource.fileData && (
              <>
                <button
                  type="button"
                  data-ocid="teacher-resources.secondary_button"
                  onClick={handlePdfPreview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.78 0.168 85 / 0.1)",
                    border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                    color: "oklch(0.88 0.168 85)",
                  }}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  type="button"
                  data-ocid="teacher-resources.primary_button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.78 0.168 85)",
                    color: "oklch(0.15 0.04 265)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </>
            )}

            {isLink && resource.externalLink && (
              <a
                href={resource.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="teacher-resources.primary_button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105"
                style={{
                  background: "oklch(0.78 0.168 85)",
                  color: "oklch(0.15 0.04 265)",
                  textDecoration: "none",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Link
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Admin Upload Panel ───────────────────────────────────────
function AdminUploadPanel({
  onAdd,
}: {
  onAdd: (resource: TeacherResource) => Promise<void>;
}) {
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
        const url = URL.createObjectURL(file);
        setPreviewSrc(url);
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

      // Reset form
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
      data-ocid="teacher-resources.panel"
      className="rounded-2xl overflow-hidden mb-12"
      style={{
        background: "oklch(0.240 0.040 265)",
        border: "1px solid oklch(0.78 0.168 85 / 0.35)",
        boxShadow:
          "0 0 60px oklch(0.78 0.168 85 / 0.08), 0 20px 40px oklch(0 0 0 / 0.3)",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.18), oklch(0.78 0.168 85 / 0.08))",
          borderBottom: "1px solid oklch(0.78 0.168 85 / 0.25)",
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: "oklch(0.78 0.168 85 / 0.15)",
            border: "1px solid oklch(0.78 0.168 85 / 0.4)",
          }}
        >
          <Plus className="w-4 h-4" style={{ color: "oklch(0.88 0.168 85)" }} />
        </div>
        <h2
          className="font-display font-bold text-xl"
          style={{ color: "oklch(0.92 0.168 85)" }}
        >
          Add New Resource
        </h2>
        <span
          className="ml-auto text-xs font-body px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.55 0.15 35 / 0.2)",
            color: "oklch(0.75 0.15 35)",
            border: "1px solid oklch(0.55 0.15 35 / 0.3)",
          }}
        >
          Admin Mode
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Title */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="tr-title"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Title *
          </label>
          <input
            id="tr-title"
            data-ocid="teacher-resources.input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Exam Paper Format – Class 8 Science"
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="tr-desc"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Short Description
          </label>
          <textarea
            id="tr-desc"
            data-ocid="teacher-resources.textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this resource..."
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Resource Type */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tr-type"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Resource Type *
          </label>
          <select
            id="tr-type"
            data-ocid="teacher-resources.select"
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

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tr-category"
            className="text-xs font-semibold font-body uppercase tracking-wider"
            style={{ color: "oklch(0.78 0.168 85)" }}
          >
            Category
          </label>
          <select
            id="tr-category"
            data-ocid="teacher-resources.select"
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

        {/* Conditional: File upload */}
        {isFileBased && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tr-file"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              {resourceType === "pdf" || resourceType === "template"
                ? "PDF File *"
                : "Image File *"}
            </label>
            <label
              htmlFor="tr-file"
              data-ocid="teacher-resources.upload_button"
              className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-body font-medium transition-all hover:scale-[1.01]"
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
                id="tr-file"
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

        {/* Conditional: External link */}
        {isLinkBased && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tr-url"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              URL / Link *
            </label>
            <input
              id="tr-url"
              data-ocid="teacher-resources.input"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
        )}

        {/* Conditional: Text content */}
        {isTextBased && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label
              htmlFor="tr-content"
              className="text-xs font-semibold font-body uppercase tracking-wider"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Content / Notice Text
            </label>
            <textarea
              id="tr-content"
              data-ocid="teacher-resources.textarea"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter the full notice, announcement, or datesheet text here..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            data-ocid="teacher-resources.error_state"
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

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            data-ocid="teacher-resources.submit_button"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold font-body text-sm transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isSubmitting
                ? "oklch(0.78 0.168 85 / 0.6)"
                : "oklch(0.78 0.168 85)",
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

// ─── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError("");

    // Small delay for UX
    setTimeout(() => {
      if (checkMainPassword(password)) {
        // Do NOT store anything in sessionStorage or localStorage.
        // The unlock state lives only in React component memory.
        // This means every page reload or fresh visit requires the password again.
        onUnlock();
      } else {
        setError("Incorrect password");
        setPassword("");
        inputRef.current?.focus();
      }
      setIsChecking(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div
        data-ocid="teacher-resources.dialog"
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.240 0.040 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.30)",
          boxShadow:
            "0 0 80px oklch(0.78 0.168 85 / 0.10), 0 30px 60px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* Top gold stripe */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.3), oklch(0.88 0.168 85), oklch(0.78 0.168 85 / 0.3))",
          }}
        />

        <div className="px-8 py-10 flex flex-col items-center gap-6">
          {/* Logo + Lock icon */}
          <div className="relative">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.15), oklch(0.78 0.168 85 / 0.05))",
                border: "2px solid oklch(0.78 0.168 85 / 0.35)",
                boxShadow: "0 0 30px oklch(0.78 0.168 85 / 0.12)",
              }}
            >
              <img
                src="/assets/uploads/WhatsApp-Image-2026-03-03-at-8.16.36-PM-1-4.jpeg"
                alt="RDS School Logo"
                className="w-14 h-14 rounded-full"
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full"
              style={{
                background: "oklch(0.78 0.168 85)",
                boxShadow: "0 0 12px oklch(0.78 0.168 85 / 0.5)",
              }}
            >
              <Lock
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.15 0.04 265)" }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1
              className="font-display font-bold text-2xl mb-1"
              style={{ color: "oklch(0.92 0.168 85)" }}
            >
              Teacher Resources
            </h1>
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.62 0.04 265)" }}
            >
              For authorized staff only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="tr-password"
                className="text-xs font-semibold font-body uppercase tracking-wider"
                style={{ color: "oklch(0.78 0.168 85)" }}
              >
                Access Password
              </label>
              <input
                id="tr-password"
                ref={inputRef}
                data-ocid="teacher-resources.input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password..."
                autoComplete="current-password"
                style={{
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
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                data-ocid="teacher-resources.error_state"
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

            {/* Submit */}
            <button
              type="submit"
              data-ocid="teacher-resources.submit_button"
              disabled={isChecking || !password}
              className="w-full py-3 rounded-xl font-semibold font-body text-sm transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "oklch(0.78 0.168 85)",
                color: "oklch(0.15 0.04 265)",
                boxShadow: "0 2px 20px oklch(0.78 0.168 85 / 0.35)",
              }}
            >
              {isChecking ? "Checking..." : "Enter"}
            </button>
          </form>

          {/* Note */}
          <p
            className="font-body text-xs text-center"
            style={{ color: "oklch(0.52 0.04 265)" }}
          >
            This section is restricted to school staff only.
            <br />
            Please contact the administration for access.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Password Prompt ─────────────────────────────────────
// Used only on the hidden /admin-panel route — NOT on the teacher resources page.
export function AdminPrompt({
  onUnlock,
  onClose,
}: {
  onUnlock: () => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(username, password)) {
      onUnlock();
    } else {
      setError("Incorrect username or password");
      setPassword("");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.9rem",
    borderRadius: "0.5rem",
    background: "oklch(0.20 0.038 268)",
    border: error
      ? "1px solid oklch(0.52 0.15 25 / 0.7)"
      : "1px solid oklch(0.78 0.168 85 / 0.25)",
    color: "oklch(0.92 0.010 80)",
    fontSize: "0.875rem",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    outline: "none",
  };

  const inputStyleClean = {
    ...inputStyle,
    border: "1px solid oklch(0.78 0.168 85 / 0.25)",
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      style={{ background: "oklch(0 0 0 / 0.70)" }}
    >
      <div
        data-ocid="teacher-resources.dialog"
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.240 0.040 265)",
          border: "1px solid oklch(0.78 0.168 85 / 0.30)",
          boxShadow:
            "0 0 60px oklch(0.78 0.168 85 / 0.12), 0 20px 40px oklch(0 0 0 / 0.45)",
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.168 85 / 0.3), oklch(0.88 0.168 85), oklch(0.78 0.168 85 / 0.3))",
          }}
        />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield
                className="w-5 h-5"
                style={{ color: "oklch(0.78 0.168 85)" }}
              />
              <h2
                className="font-display font-bold text-lg"
                style={{ color: "oklch(0.92 0.168 85)" }}
              >
                Admin Access
              </h2>
            </div>
            <button
              type="button"
              data-ocid="teacher-resources.close_button"
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "oklch(0.60 0.04 265)" }}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Username field */}
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
                data-ocid="teacher-resources.input"
                type="text"
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username..."
                style={inputStyleClean}
              />
            </div>

            {/* Password field */}
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
                data-ocid="teacher-resources.input"
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
              <p
                data-ocid="teacher-resources.error_state"
                className="text-xs font-body flex items-center gap-1.5"
                style={{ color: "oklch(0.72 0.12 25)" }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="teacher-resources.cancel_button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg text-sm font-body font-medium transition-all"
                style={{
                  background: "oklch(0.78 0.168 85 / 0.08)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                  color: "oklch(0.78 0.04 265)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-ocid="teacher-resources.confirm_button"
                disabled={!username || !password}
                className="flex-1 py-2 rounded-lg text-sm font-body font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: "oklch(0.78 0.168 85)",
                  color: "oklch(0.15 0.04 265)",
                }}
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── localStorage helpers ─────────────────────────────────────
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

// ─── Normalize backend resource (handles bigint timestamps) ──────
function normalizeResource(r: unknown): TeacherResource {
  const raw = r as Record<string, unknown>;
  // Backend stores uploadedAt as Int.abs(Time.now() / 1_000_000_000) = seconds.
  // Convert to milliseconds for new Date(Number(ts)).
  // If value is already in ms range (>= year 2000 in ms = 946684800000),
  // don't multiply again. Threshold: if > 10^12 it's already ms.
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

// ─── Notice Board (shown to teachers after password) ──────────
function NoticeBoardView({
  adminMode,
}: {
  adminMode: boolean;
}) {
  const { actor, isFetching: actorFetching } = useActor();

  // 1. Load from localStorage synchronously so resources appear instantly.
  const [resources, setResources] = useState<TeacherResource[]>(() =>
    loadResourcesFromStorage(),
  );
  // Never show a loading spinner or error — localStorage is always available.
  const [isLoading] = useState(false);
  const [loadError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // Background sync: if the actor becomes available, pull from backend and
  // merge any new items into localStorage. Failures are silently ignored.
  const loadResources = useCallback(async (actorInstance: typeof actor) => {
    if (!actorInstance) return;
    try {
      const res = await actorInstance.getAllTeacherResources();
      const normalized = (res as unknown[]).map(normalizeResource);
      if (normalized.length > 0) {
        setResources(normalized);
        saveResourcesToStorage(normalized);
      }
    } catch {
      // Backend unavailable — localStorage data already shown, no error needed
    }
  }, []);

  useEffect(() => {
    if (actorFetching || !actor) return;
    loadResources(actor);
  }, [actor, actorFetching, loadResources]);

  const handleAddResource = async (
    resource: TeacherResource,
  ): Promise<void> => {
    // 1. Save to localStorage and update UI immediately.
    const updated = [resource, ...resources];
    setResources(updated);
    saveResourcesToStorage(updated);
    setSuccessMsg(`"${resource.title}" added successfully!`);
    setTimeout(() => setSuccessMsg(""), 3500);

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

  // ── Compute filtered resources ─────────────────────────────
  const filteredResources = resources.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchesSearch && matchesCategory(r, activeCategory);
  });

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div
        className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.05 265) 0%, oklch(0.185 0.035 268) 100%)",
          borderBottom: "1px solid oklch(0.36 0.052 265 / 0.5)",
        }}
      >
        {/* Decorative glow */}
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
            R D S Meena Memorial Public School
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl"
            style={{
              color: "oklch(0.95 0.012 80)",
              textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            Teacher{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.168 85), oklch(0.72 0.168 85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Resources
            </span>
          </h1>
          <p
            className="font-body text-base mt-3 max-w-xl"
            style={{ color: "oklch(0.72 0.04 265)" }}
          >
            Official resources, notices, datesheets, and announcements for
            teaching staff.
          </p>
        </div>
      </div>

      {/* Main content */}
      <section
        data-ocid="teacher-resources.section"
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.185 0.035 268)" }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Success toast */}
          {successMsg && (
            <div
              data-ocid="teacher-resources.success_state"
              className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-body font-medium"
              style={{
                background: "oklch(0.45 0.14 150 / 0.15)",
                border: "1px solid oklch(0.55 0.14 150 / 0.35)",
                color: "oklch(0.75 0.14 150)",
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          {/* Admin panel (visible only in admin mode) */}
          {adminMode && <AdminUploadPanel onAdd={handleAddResource} />}

          {/* Notice board section header */}
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold font-body mb-3"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Notice Board
            </p>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl mb-3"
              style={{
                color: "oklch(0.95 0.012 80)",
                textShadow: "0 0 40px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              Resources &{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.88 0.168 85), oklch(0.72 0.168 85))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Announcements
              </span>
            </h2>
            {/* Gold divider */}
            <div className="flex items-center justify-center gap-3 mb-4">
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
                  background: "oklch(0.78 0.168 85)",
                  borderRadius: "2px",
                  boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.5)",
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
          </div>

          {/* ── Search bar ─────────────────────────────────── */}
          <div className="relative mb-5 max-w-xl mx-auto">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "oklch(0.62 0.04 265)" }}
            />
            <input
              type="text"
              data-ocid="teacher-resources.search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title or description..."
              style={{
                width: "100%",
                padding: "0.65rem 1rem 0.65rem 2.5rem",
                borderRadius: "0.625rem",
                background: "oklch(0.20 0.038 268)",
                border: "1px solid oklch(0.78 0.168 85 / 0.22)",
                color: "oklch(0.92 0.010 80)",
                fontSize: "0.875rem",
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* ── Category filter buttons ─────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  data-ocid="teacher-resources.tab"
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-body font-semibold transition-all duration-200 hover:scale-105"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.78 0.168 85)",
                          color: "oklch(0.15 0.04 265)",
                          boxShadow: "0 2px 12px oklch(0.78 0.168 85 / 0.35)",
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

          {/* ── Google Drive Resource Library button ────────── */}
          <div className="flex justify-center mb-10">
            <a
              href="https://drive.google.com/drive/folders/17cbuJXEgi7AiVOj9G4iWmO12gHH208nK"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="teacher-resources.primary_button"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold font-body text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.168 85), oklch(0.68 0.168 75))",
                color: "oklch(0.12 0.04 265)",
                boxShadow:
                  "0 4px 24px oklch(0.78 0.168 85 / 0.40), 0 1px 4px oklch(0 0 0 / 0.2)",
                textDecoration: "none",
                border: "1.5px solid oklch(0.88 0.168 85 / 0.5)",
                letterSpacing: "0.01em",
              }}
            >
              <FolderOpen className="w-5 h-5 shrink-0" />
              Open Full Resource Library
              <ExternalLink className="w-4 h-4 shrink-0 opacity-75" />
            </a>
          </div>

          {/* Resources grid / loading / empty state */}
          {isLoading ? (
            <div
              data-ocid="teacher-resources.loading_state"
              className="text-center py-20"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{
                  background: "oklch(0.78 0.168 85 / 0.08)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                }}
              >
                <BookOpen
                  className="w-7 h-7 animate-pulse"
                  style={{ color: "oklch(0.78 0.168 85 / 0.7)" }}
                />
              </div>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                Loading resources...
              </p>
            </div>
          ) : loadError ? (
            <div
              data-ocid="teacher-resources.error_state"
              className="text-center py-20"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{
                  background: "oklch(0.52 0.15 25 / 0.1)",
                  border: "1px solid oklch(0.52 0.15 25 / 0.3)",
                }}
              >
                <AlertCircle
                  className="w-7 h-7"
                  style={{ color: "oklch(0.75 0.12 25)" }}
                />
              </div>
              <h3
                className="font-display font-semibold text-xl mb-2"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                Could not load resources
              </h3>
              <p
                className="font-body text-sm mb-4"
                style={{ color: "oklch(0.55 0.04 265)" }}
              >
                There was a problem connecting to the server.
              </p>
              <button
                type="button"
                data-ocid="teacher-resources.secondary_button"
                onClick={() => loadResources(actor)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-body font-semibold transition-all hover:scale-105"
                style={{
                  background: "oklch(0.78 0.168 85)",
                  color: "oklch(0.15 0.04 265)",
                  boxShadow: "0 2px 16px oklch(0.78 0.168 85 / 0.3)",
                }}
              >
                Try Again
              </button>
            </div>
          ) : resources.length === 0 ? (
            <div
              data-ocid="teacher-resources.empty_state"
              className="text-center py-20"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{
                  background: "oklch(0.78 0.168 85 / 0.08)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                }}
              >
                <BookOpen
                  className="w-7 h-7"
                  style={{ color: "oklch(0.78 0.168 85 / 0.6)" }}
                />
              </div>
              <h3
                className="font-display font-semibold text-xl mb-2"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                No resources uploaded yet
              </h3>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.55 0.04 265)" }}
              >
                Admin can add resources via the admin panel.
              </p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div
              data-ocid="teacher-resources.empty_state"
              className="text-center py-16"
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                style={{
                  background: "oklch(0.78 0.168 85 / 0.08)",
                  border: "1px solid oklch(0.78 0.168 85 / 0.2)",
                }}
              >
                <Search
                  className="w-6 h-6"
                  style={{ color: "oklch(0.78 0.168 85 / 0.6)" }}
                />
              </div>
              <h3
                className="font-display font-semibold text-lg mb-2"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                No resources found for your search or filter.
              </h3>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.55 0.04 265)" }}
              >
                Try adjusting your search query or selecting a different
                category.
              </p>
            </div>
          ) : (
            <div
              data-ocid="teacher-resources.list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  data-ocid={`teacher-resources.item.${index + 1}`}
                >
                  <ResourceCard
                    resource={resource}
                    adminMode={adminMode}
                    onDelete={handleDeleteResource}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Main Teacher Resources Page ───────────────────────────────
// IMPORTANT: unlocked state is NEVER stored in sessionStorage or localStorage.
// This means:
// - Every page visit (fresh tab, incognito, reload) requires the password.
// - The password prompt ONLY shows when navigating to /teacher-resources.
// - It does NOT auto-appear on the home page or any other page.
export function TeacherResourcesPage() {
  // Always start locked — NEVER read from sessionStorage or localStorage.
  // Any old session keys are cleared immediately to prevent stale unlock state.
  const [unlocked, setUnlocked] = useState<boolean>(false);

  // On mount, clear any legacy sessionStorage keys that old versions may have
  // written, so the page can never remain unlocked across reloads.
  useEffect(() => {
    try {
      sessionStorage.removeItem("rds-teacher-unlocked");
      sessionStorage.removeItem("rds-tr-unlocked");
      sessionStorage.removeItem("teacher-resources-unlocked");
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = () => {
    // NoticeBoardView fetches from backend on mount, so resources are always
    // up-to-date for every user including incognito visitors.
    setUnlocked(true);
  };

  // ── Locked view: show password gate ───────────────────────
  if (!unlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  // ── Unlocked view: show notice board (no admin controls, no admin button) ─
  return <NoticeBoardView adminMode={false} />;
}
