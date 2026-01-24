import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminRoute } from "@/pages/commons/AdminRoute";
import { LazyElement } from "@/components/custom/LazyElement";

// ===========================================================
// AUTH PAGE
// ===========================================================
const AuthPage = lazy(() => import("@/pages/auth-page"));

// ===========================================================
// ADMIN PAGES
// ===========================================================
const AdminPage = lazy(() => import("@/pages/main-route-pages"));
const AccountManagementPage = lazy(
  () => import("@/pages/main-route-pages/account-page"),
);
const BlogManagementPage = lazy(
  () => import("@/pages/main-route-pages/blog-page"),
);
const StatisticsManagementPage = lazy(
  () => import("@/pages/main-route-pages/statistic-page"),
);
const MusicManagementPage = lazy(
  () => import("@/pages/main-route-pages/music-page"),
);
const AlbumManagementPage = lazy(
  () => import("@/pages/main-route-pages/album-page"),
);
const ArtistManagementPage = lazy(
  () => import("@/pages/main-route-pages/artist-page"),
);
const GenreManagementPage = lazy(
  () => import("@/pages/main-route-pages/genre-page"),
);
const ReelManagementPage = lazy(
  () => import("@/pages/main-route-pages/reel-page"),
);

export const router = createBrowserRouter([
  // ===========================================================
  // AUTH ROUTE
  // ===========================================================
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: (
      <LazyElement>
        <AuthPage />
      </LazyElement>
    ),
  },

  // ===========================================================
  // ADMIN ROUTES (Admin Only)
  // ===========================================================
  {
    path: "admin",
    element: (
      <AdminRoute>
        <LazyElement>
          <AdminPage />
        </LazyElement>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/statistics" replace /> },
      {
        path: "accounts",
        element: (
          <LazyElement>
            <AccountManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "blogs",
        element: (
          <LazyElement>
            <BlogManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "statistics",
        element: (
          <LazyElement>
            <StatisticsManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "music",
        element: (
          <LazyElement>
            <MusicManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "albums",
        element: (
          <LazyElement>
            <AlbumManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "artists",
        element: (
          <LazyElement>
            <ArtistManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "genres",
        element: (
          <LazyElement>
            <GenreManagementPage />
          </LazyElement>
        ),
      },
      {
        path: "reels",
        element: (
          <LazyElement>
            <ReelManagementPage />
          </LazyElement>
        ),
      },
    ],
  },
]);
