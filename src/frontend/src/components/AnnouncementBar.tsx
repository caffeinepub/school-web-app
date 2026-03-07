import { Bell } from "lucide-react";

const ANNOUNCEMENT_TEXT =
  "📢 Admissions Open for Nursery to Class 8 – Session 2026 | R D S Meena Memorial Public School, Bahjoi (Sambhal)";

function openAdmissionPopup() {
  window.dispatchEvent(new CustomEvent("open-admission-popup"));
}

export function AnnouncementBar() {
  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .announcement-marquee {
          display: flex;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
          will-change: transform;
        }
        .announcement-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        role="banner"
        aria-label="School announcement"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: "40px",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(90deg, oklch(0.48 0.16 52), oklch(0.60 0.21 62), oklch(0.66 0.23 72), oklch(0.60 0.21 62), oklch(0.48 0.16 52))",
          backgroundSize: "200% 100%",
          boxShadow:
            "0 2px 12px oklch(0.60 0.21 62 / 0.55), 0 1px 3px oklch(0 0 0 / 0.3)",
          borderBottom: "1px solid oklch(0.72 0.20 78 / 0.5)",
        }}
      >
        {/* Bell icon — left side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: "40px",
            height: "100%",
            borderRight: "1px solid oklch(0.72 0.20 78 / 0.35)",
          }}
        >
          <Bell
            aria-hidden="true"
            style={{
              width: "15px",
              height: "15px",
              color: "oklch(0.12 0.04 265)",
              filter: "drop-shadow(0 0 3px oklch(0.12 0.04 265 / 0.4))",
            }}
          />
        </div>

        {/* Scrolling text — fills remaining space */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            height: "100%",
            display: "flex",
            alignItems: "center",
            mask: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
            WebkitMask:
              "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
          }}
        >
          <div className="announcement-marquee">
            {/* Duplicate the text so loop is seamless */}
            <span
              style={{
                paddingRight: "4rem",
                color: "oklch(0.10 0.04 265)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.025em",
                whiteSpace: "nowrap",
                fontFamily: '"Plus Jakarta Sans", "Poppins", sans-serif',
              }}
            >
              {ANNOUNCEMENT_TEXT}
            </span>
            <span
              aria-hidden="true"
              style={{
                paddingRight: "4rem",
                color: "oklch(0.10 0.04 265)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.025em",
                whiteSpace: "nowrap",
                fontFamily: '"Plus Jakarta Sans", "Poppins", sans-serif',
              }}
            >
              {ANNOUNCEMENT_TEXT}
            </span>
          </div>
        </div>

        {/* Apply Now button — right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            paddingRight: "8px",
            paddingLeft: "8px",
            height: "100%",
            borderLeft: "1px solid oklch(0.72 0.20 78 / 0.35)",
          }}
        >
          <button
            type="button"
            data-ocid="announcement.apply_now.button"
            onClick={openAdmissionPopup}
            style={{
              padding: "0 12px",
              height: "26px",
              borderRadius: "9999px",
              border: "1.5px solid oklch(0.10 0.04 265 / 0.6)",
              background: "oklch(0.12 0.04 265)",
              color: "oklch(0.84 0.18 80)",
              fontSize: "0.70rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              cursor: "pointer",
              fontFamily: '"Plus Jakarta Sans", "Poppins", sans-serif',
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 1px 6px oklch(0 0 0 / 0.25)",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px oklch(0 0 0 / 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 1px 6px oklch(0 0 0 / 0.25)";
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
}
