import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { incrementVisitors } from "./lib/firebase";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const VISITOR_SESSION_KEY = "rds-visitor-counted";

export default function App() {
  useEffect(() => {
    // Only count once per browser session
    if (!sessionStorage.getItem(VISITOR_SESSION_KEY)) {
      sessionStorage.setItem(VISITOR_SESSION_KEY, "true");
      incrementVisitors();
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.035 265)",
            border: "1px solid oklch(0.78 0.168 85 / 0.35)",
            color: "oklch(0.95 0.012 80)",
          },
        }}
      />
    </>
  );
}
