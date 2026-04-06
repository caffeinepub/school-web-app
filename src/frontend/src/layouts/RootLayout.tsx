import { Outlet, useRouterState } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Instagram,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { AdmissionPopup } from "../components/AdmissionPopup";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { ExamCornerButton } from "../components/ExamCornerButton";
import { LikeButton } from "../components/LikeButton";
import {
  useAllStudents,
  useAllTeachers,
  useSeedData,
} from "../hooks/useQueries";

const NAV_LINKS = [
  { label: "Home", to: "/" as const, ocid: "nav.home.link" },
  {
    label: "Teacher Panel",
    to: "/teachers" as const,
    ocid: "nav.teachers.link",
  },
  { label: "Students", to: "/students" as const, ocid: "nav.students.link" },
  { label: "About Us", to: "/about" as const, ocid: "nav.about.link" },
  { label: "Fees", to: "/fees" as const, ocid: "nav.fees.link" },
  {
    label: "Teacher Resources",
    to: "/teacher-resources" as const,
    ocid: "nav.teacher-resources.link",
  },
];

// ── Theme hook ──────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState<boolean>(() => {
    try {
      return localStorage.getItem("rds-theme") === "light";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isLight) {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
    try {
      localStorage.setItem("rds-theme", isLight ? "light" : "dark");
    } catch {
      // ignore
    }
  }, [isLight]);

  const toggle = () => setIsLight((v) => !v);
  return { isLight, toggle };
}

// ── Scroll-aware offset hook ────────────────────────
// When user is near the footer, lifts buttons up to avoid overlap
function useFloatingButtonOffset() {
  const [extraOffset, setExtraOffset] = useState(0);

  useEffect(() => {
    const FOOTER_CLEARANCE = 80; // px of footer we want to stay clear of

    function update() {
      const scrollBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      // As user gets within FOOTER_CLEARANCE px of the bottom, push buttons up
      if (scrollBottom < FOOTER_CLEARANCE) {
        setExtraOffset(FOOTER_CLEARANCE - scrollBottom);
      } else {
        setExtraOffset(0);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return extraOffset;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isLight, toggle } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll to top on every route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the intentional trigger
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  const goldColor = "oklch(0.78 0.168 85)";

  return (
    <header
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 glass-nav ${
        scrolled ? "scrolled-nav" : ""
      }`}
    >
      {/* Top gold highlight line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.168_85/0.6)] to-transparent" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none"
            data-ocid="nav.home.link"
            onClick={scrollToTop}
          >
            <div
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.168 85 / 0.15), oklch(0.78 0.168 85 / 0.05))",
                border: "1px solid oklch(0.78 0.168 85 / 0.4)",
              }}
            >
              <img
                src="/assets/generated/school-crest-transparent.dim_120x120.png"
                alt="R D S Meena Memorial School crest"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("style");
                }}
              />
              <GraduationCap
                className="w-5 h-5 text-gold absolute"
                style={{ display: "none" }}
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-display font-bold text-lg sm:text-xl leading-none tracking-wide group-hover:glow-gold-text-subtle transition-all"
                style={{ color: goldColor }}
              >
                R D S Meena Memorial Public School
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-body font-medium leading-none mt-0.5"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                Bahjoi (Sambhal)
              </span>
            </div>
          </Link>

          {/* Desktop nav + theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                onClick={scrollToTop}
                className={`nav-link px-4 py-2 text-sm font-medium font-body rounded-md transition-all duration-200 ${
                  isActive(link.to)
                    ? "active"
                    : "text-foreground/75 hover:text-gold"
                }`}
                style={isActive(link.to) ? { color: goldColor } : {}}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme toggle button */}
            <button
              type="button"
              data-ocid="nav.theme.toggle"
              onClick={toggle}
              aria-label={
                isLight ? "Switch to Dark Mode" : "Switch to Light Mode"
              }
              className="ml-2 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "oklch(0.78 0.168 85 / 0.1)",
                border: "1px solid oklch(0.78 0.168 85 / 0.3)",
                color: goldColor,
                boxShadow: "0 0 8px oklch(0.78 0.168 85 / 0.15)",
              }}
            >
              {isLight ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile: theme toggle + menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              data-ocid="nav.theme.toggle.mobile"
              onClick={toggle}
              aria-label={
                isLight ? "Switch to Dark Mode" : "Switch to Light Mode"
              }
              className="p-2 rounded-full transition-all duration-300"
              style={{
                background: "oklch(0.78 0.168 85 / 0.08)",
                border: "1px solid oklch(0.78 0.168 85 / 0.25)",
                color: goldColor,
              }}
            >
              {isLight ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-lg transition-colors"
              style={{
                color: goldColor,
                background: "oklch(0.78 0.168 85 / 0.08)",
              }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden pb-4"
            style={{
              borderTop: "1px solid oklch(0.78 0.168 85 / 0.15)",
            }}
          >
            <div className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToTop();
                  }}
                  className={`px-4 py-3 text-sm font-medium font-body rounded-lg transition-all ${
                    isActive(link.to)
                      ? "bg-[oklch(0.78_0.168_85/0.08)]"
                      : "text-foreground/75 hover:bg-[oklch(0.78_0.168_85/0.05)]"
                  }`}
                  style={isActive(link.to) ? { color: goldColor } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="relative mt-24 pt-16 pb-8"
      style={{
        background: "oklch(var(--card))",
        borderTop: "1px solid oklch(var(--border) / 0.6)",
      }}
    >
      {/* Top gold gradient line */}
      <div className="gold-divider-thick absolute top-0 left-8 right-8" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap
                className="w-5 h-5"
                style={{ color: "oklch(0.78 0.168 85)" }}
              />
              <span
                className="font-display font-bold text-lg"
                style={{ color: "oklch(0.88 0.168 85)" }}
              >
                R D S Meena Memorial Public School
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.70 0.04 265)" }}
            >
              Nurturing minds and shaping futures. A tradition of excellence in
              education at Bahjoi, Sambhal.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-display font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Navigate
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-sm transition-colors hover:text-gold"
                    style={{ color: "oklch(0.70 0.04 265)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: "oklch(0.78 0.168 85)" }}
            >
              Contact
            </h4>
            <address
              className="not-italic text-sm space-y-3"
              style={{ color: "oklch(0.70 0.04 265)" }}
            >
              <p>Bahjoi, Sambhal, U.P.</p>
              <a
                href="tel:+918279968905"
                className="flex items-center gap-2 hover:text-gold transition-colors"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                <Phone
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                />
                +91 82799 68905
              </a>
              <a
                href="tel:+919756940494"
                className="flex items-center gap-2 hover:text-gold transition-colors"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                <Phone
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                />
                +91 97569 40494
              </a>
              <a
                href="https://www.instagram.com/rdsschool_7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                <Instagram
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                />
                @rdsschool_7
              </a>
              <a
                href="https://maps.app.goo.gl/oob7NmFvPZ16VM5X9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
                style={{ color: "oklch(0.72 0.04 265)" }}
              >
                <MapPin
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "oklch(0.78 0.168 85)" }}
                />
                View on Google Maps
              </a>
            </address>
          </div>
        </div>

        <div className="gold-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "oklch(0.62 0.04 265)" }}>
            © {year} R D S Meena Memorial Public School. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "oklch(0.62 0.04 265)" }}>
            Built with <span style={{ color: "oklch(0.78 0.168 85)" }}>♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
              style={{ color: "oklch(0.72 0.04 265)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
        {/* ── Creator Credit ── */}
        <div
          className="text-center mt-6 pt-5"
          style={{ borderTop: "1px solid oklch(0.78 0.168 85 / 0.12)" }}
        >
          <p
            style={{
              color: "oklch(0.88 0.168 85)",
              fontSize: "1.0rem",
              fontWeight: "700",
              letterSpacing: "0.05em",
              textAlign: "center",
              textShadow:
                "0 0 14px oklch(0.78 0.168 85 / 0.8), 0 0 32px oklch(0.78 0.168 85 / 0.45), 0 2px 8px oklch(0 0 0 / 0.4)",
              filter: "drop-shadow(0 0 8px oklch(0.78 0.168 85 / 0.6))",
              lineHeight: "1.7",
            }}
          >
            Created by .....🧢 Dipanshu7
          </p>
          <p
            style={{
              color: "oklch(0.82 0.155 85)",
              fontSize: "0.92rem",
              fontWeight: "600",
              letterSpacing: "0.03em",
              textAlign: "center",
              marginTop: "4px",
              textShadow:
                "0 0 10px oklch(0.78 0.168 85 / 0.5), 0 0 24px oklch(0.78 0.168 85 / 0.25), 0 1px 6px oklch(0 0 0 / 0.35)",
              filter: "drop-shadow(0 0 5px oklch(0.78 0.168 85 / 0.4))",
            }}
          >
            contact for creation and work :{" "}
            <a
              href="mailto:dipanshu6395297305@gmail.com"
              style={{
                color: "oklch(0.88 0.168 85)",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              dipanshu6395297305@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Seed data initializer
function DataInitializer() {
  const { data: teachers, isSuccess: teachersLoaded } = useAllTeachers();
  const { data: students, isSuccess: studentsLoaded } = useAllStudents();
  const { mutate: seedData } = useSeedData();
  const seeded = useRef(false);

  useEffect(() => {
    if (
      !seeded.current &&
      teachersLoaded &&
      studentsLoaded &&
      teachers &&
      students &&
      teachers.length === 0 &&
      students.length === 0
    ) {
      seeded.current = true;
      seedData();
    }
  }, [teachersLoaded, studentsLoaded, teachers, students, seedData]);

  return null;
}

export function RootLayout() {
  const admissionOpenRef = useRef<(() => void) | null>(
    null,
  ) as React.MutableRefObject<(() => void) | null>;

  // Scroll-aware offset: lifts floating buttons when near the footer
  const extraOffset = useFloatingButtonOffset();
  const floatingBottom = 24 + extraOffset; // 24px base = bottom-6

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <DataInitializer />
      <AdmissionPopup forceOpenRef={admissionOpenRef} />
      <AnnouncementBar />
      <Navbar />
      {/* pt = announcement bar (40px = 2.5rem) + navbar (64px sm:80px) */}
      <main className="w-full flex-1 pt-[104px] sm:pt-[120px]">
        <Outlet />
      </main>
      <Footer />

      {/* Floating buttons stack — scroll-aware bottom position */}
      <div
        className="fixed right-6 z-40 flex flex-col items-end gap-3"
        style={{
          bottom: `${floatingBottom}px`,
          transition: "bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Like button - above Exam Corner */}
        <LikeButton />
        {/* Exam Corner button + popup */}
        <div className="relative">
          <ExamCornerButton />
        </div>
        {/* Permanent floating admission button */}
        <button
          type="button"
          data-ocid="home.admission.open_modal_button"
          onClick={() => {
            if (admissionOpenRef.current) {
              admissionOpenRef.current();
            } else {
              window.dispatchEvent(new CustomEvent("open-admission-popup"));
            }
          }}
          className="btn-gold flex items-center gap-2 px-5 py-3 rounded-full font-semibold font-body text-sm shadow-lg"
          style={{
            boxShadow:
              "0 4px 24px oklch(0.78 0.168 85 / 0.45), 0 2px 8px oklch(0 0 0 / 0.3)",
            animation: "pulse-gold 2.5s ease-in-out infinite",
          }}
        >
          🎓 Admission Open
        </button>
      </div>
    </div>
  );
}
