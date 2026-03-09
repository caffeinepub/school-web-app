import { createRootRoute, createRoute } from "@tanstack/react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AboutPage } from "./pages/AboutPage";
import { AdminPanelPage } from "./pages/AdminPanelPage";
import { FeesPage } from "./pages/FeesPage";
import { HomePage } from "./pages/HomePage";
import { StudentsPage } from "./pages/StudentsPage";
import { TeacherResourcesPage } from "./pages/TeacherResourcesPage";
import { TeachersPage } from "./pages/TeachersPage";

// Root route that wraps all public pages in the full site layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers",
  component: TeachersPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: StudentsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees",
  component: FeesPage,
});

const teacherResourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher-resources",
  component: TeacherResourcesPage,
});

// Hidden admin route — renders inside RootLayout but AdminPanelPage manages its own full-screen UI
// Not linked anywhere in the public navbar, footer, or Teacher Resources page.
const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-panel",
  component: AdminPanelPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  teachersRoute,
  studentsRoute,
  aboutRoute,
  feesRoute,
  teacherResourcesRoute,
  adminPanelRoute,
]);
