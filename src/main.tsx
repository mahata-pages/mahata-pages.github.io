import "@acab/reset.css";
import "@/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Layout } from "@/Layout";
import { Home } from "@/pages/Home";
import Health from "@/routes/Health";
import Post from "@/routes/Post";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts/:slug",
        element: <Post />,
      },
    ],
  },
  {
    path: "/health",
    element: <Health />,
  },
  {
    path: "/feed",
    element: <Navigate to="/rss.xml" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
