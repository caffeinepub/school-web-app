import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { getAnalytics, incrementLikes } from "../lib/firebase";

const LIKE_KEY = "rds-site-liked";
const ADMIN_SESSION_KEY = "rds-admin-session";

function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function hasLiked(): boolean {
  try {
    return localStorage.getItem(LIKE_KEY) === "true";
  } catch {
    return false;
  }
}

function markLiked() {
  try {
    localStorage.setItem(LIKE_KEY, "true");
  } catch {
    // ignore
  }
}

const BURST_INDICES = [0, 1, 2, 3, 4];

export function LikeButton() {
  const { actor } = useActor();
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    setLiked(hasLiked());
    const admin = isAdminLoggedIn();
    setIsAdmin(admin);
    if (admin) {
      // Load likes from Firestore for admin display
      getAnalytics()
        .then(({ likes }) => setLikeCount(likes))
        .catch(() => {
          // fallback to backend actor if Firestore fails
          if (actor) {
            actor
              .getLikeCount()
              .then((n) => setLikeCount(Number(n)))
              .catch(() => {});
          }
        });
    }
  }, [actor]);

  async function handleClick() {
    if (liked || animating) return;
    setLiked(true);
    markLiked();
    setAnimating(true);
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
    setTimeout(() => setAnimating(false), 600);

    // Increment in Firestore (primary) and backend actor (secondary)
    const newCount = await incrementLikes();
    if (newCount > 0) setLikeCount(newCount);

    if (actor) {
      try {
        const actorCount = await actor.addLike();
        // Only update if Firestore didn't return a valid count
        if (newCount === 0) setLikeCount(Number(actorCount));
      } catch {
        // ignore
      }
    }
  }

  const gold = "oklch(0.78 0.168 85)";

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {burst &&
          BURST_INDICES.map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
              animate={{
                opacity: 0,
                y: -44 - i * 7,
                x: (i - 2) * 13,
                scale: 1.1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: i * 0.06 }}
              className="absolute pointer-events-none select-none"
              style={{ fontSize: "13px", top: 0, zIndex: 10 }}
            >
              ❤️
            </motion.span>
          ))}
      </AnimatePresence>

      {isAdmin && likeCount !== null && (
        <div
          data-ocid="like.count.card"
          className="mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-center whitespace-nowrap"
          style={{
            background: "oklch(0.22 0.05 260)",
            color: gold,
            border: "1px solid oklch(0.78 0.168 85 / 0.35)",
            minWidth: "28px",
            boxShadow: "0 2px 8px oklch(0 0 0 / 0.3)",
          }}
        >
          {likeCount} ❤️
        </div>
      )}

      <motion.button
        type="button"
        data-ocid="like.button"
        onClick={handleClick}
        whileTap={liked ? {} : { scale: 1.3 }}
        animate={animating ? { scale: [1, 1.45, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        title={liked ? "You've liked this website!" : "Like this website"}
        className="flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: "48px",
          height: "48px",
          background: liked
            ? "linear-gradient(135deg, oklch(0.32 0.10 15), oklch(0.24 0.07 10))"
            : "linear-gradient(135deg, oklch(0.28 0.06 260), oklch(0.22 0.05 255))",
          border: liked
            ? "1px solid rgba(229,62,62,0.5)"
            : "1px solid oklch(0.78 0.168 85 / 0.4)",
          boxShadow: liked
            ? "0 4px 20px rgba(229,62,62,0.4), 0 2px 8px oklch(0 0 0 / 0.4)"
            : "0 4px 20px oklch(0.78 0.168 85 / 0.3), 0 2px 8px oklch(0 0 0 / 0.4)",
          cursor: liked ? "default" : "pointer",
          fontSize: "20px",
        }}
      >
        <span
          style={{
            filter: liked ? "none" : "grayscale(0.25) brightness(0.9)",
            transition: "filter 0.3s",
            lineHeight: 1,
          }}
        >
          ❤️
        </span>
      </motion.button>
    </div>
  );
}
