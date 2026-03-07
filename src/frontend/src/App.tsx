import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
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
