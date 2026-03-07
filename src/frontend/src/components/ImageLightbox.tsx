import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const overlayRef = useRef<HTMLDialogElement>(null);

  // Open: set open first (mounts DOM), then trigger animation on next frame
  function openLightbox() {
    setImgLoaded(false); // reset loaded state each time the lightbox opens
    setOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }

  const closeLightbox = useCallback(() => {
    setVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setOpen(false);
      setImgLoaded(false);
    }, 280);
  }, []);

  // Escape key support
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeLightbox]);

  // Prevent body scroll while open
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

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === overlayRef.current) closeLightbox();
  }

  function handleBackdropKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeLightbox();
  }

  return (
    <>
      {/* Trigger wrapper — use a button for full a11y compliance */}
      <button
        type="button"
        onClick={openLightbox}
        aria-label={`View full size: ${alt}`}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          width: "100%",
          cursor: "zoom-in",
          display: "block",
          textAlign: "left",
        }}
      >
        {children}
      </button>

      {/* Lightbox overlay */}
      {open && (
        <dialog
          ref={overlayRef}
          open
          data-ocid="lightbox.dialog"
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          aria-label={`Full size view: ${alt}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: visible ? "oklch(0 0 0 / 0.88)" : "oklch(0 0 0 / 0)",
            backdropFilter: visible ? "blur(4px)" : "none",
            WebkitBackdropFilter: visible ? "blur(4px)" : "none",
            transition: "background 0.28s ease, backdrop-filter 0.28s ease",
            padding: "1rem",
            border: "none",
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            data-ocid="lightbox.close.button"
            onClick={closeLightbox}
            aria-label="Close image"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              border: "1px solid oklch(0.78 0.168 85 / 0.5)",
              background: "oklch(0.155 0.032 265 / 0.9)",
              color: "oklch(0.88 0.168 85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              zIndex: 201,
              opacity: visible ? 1 : 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.78 0.168 85 / 0.15)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.155 0.032 265 / 0.9)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image container */}
          <div
            style={{
              transform: visible ? "scale(1)" : "scale(0.85)",
              opacity: visible ? 1 : 0,
              transition:
                "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease",
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "0.875rem",
              overflow: "hidden",
              border: "1px solid oklch(0.78 0.168 85 / 0.4)",
              boxShadow:
                "0 0 80px oklch(0.78 0.168 85 / 0.2), 0 32px 64px oklch(0 0 0 / 0.5)",
              background: "transparent",
              position: "relative",
            }}
          >
            {/* Shimmer placeholder — shows until image loads */}
            {!imgLoaded && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "0.875rem",
                  background:
                    "linear-gradient(90deg, oklch(0.18 0.035 266) 0%, oklch(0.24 0.04 265) 40%, oklch(0.18 0.035 266) 80%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite linear",
                  zIndex: 1,
                }}
              />
            )}
            <img
              src={src}
              alt={alt}
              onLoad={() => setImgLoaded(true)}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                display: "block",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
                position: "relative",
                zIndex: 2,
              }}
            />
          </div>
        </dialog>
      )}
    </>
  );
}
