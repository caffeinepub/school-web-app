import { createRootRoute, createRoute } from "@tanstack/react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AboutPage } from "./pages/AboutPage";
import { FeesPage } from "./pages/FeesPage";
import { HomePage } from "./pages/HomePage";
import { StudentsPage } from "./pages/StudentsPage";
import { TeachersPage } from "./pages/TeachersPage";

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

export const routeTree = rootRoute.addChildren([
  indexRoute,
  teachersRoute,
  studentsRoute,
  aboutRoute,
  feesRoute,
]);
