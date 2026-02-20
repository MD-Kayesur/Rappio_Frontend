import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";


import AdminLayout from "@/Layout/AdminLayout/AdminLayout";
import Overview from "@/pages/Admin/Overview";
import FeedOrdering from "@/pages/Admin/FeedOrdering";
import Analytics from "@/pages/Admin/Analytics";
import Settings from "@/pages/Admin/Settings";
import AdminRoutes from "./AdminRoutes";

const AdminOwnRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "admin",
        element: <AdminRoutes />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Overview /> },
              { path: "overview", element: <Overview /> },
              { path: "feed-ordering", element: <FeedOrdering /> },
              { path: "analytics", element: <Analytics /> },
              { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default AdminOwnRoute;