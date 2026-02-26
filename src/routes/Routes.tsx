import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import AdminRoute from "./AdminRoutes";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import UserLayout from "@/Layout/UserLayout/UserLayout";
import Videos from "@/pages/User/Videos";
import Photos from "@/pages/User/Photos";
import Favorites from "@/pages/User/Favorites";
import Categories from "@/pages/User/TopCasinos";
import AdminLayout from "@/Layout/AdminLayout/AdminLayout";
import Overview from "@/pages/Admin/Overview";
import FeedOrdering from "@/pages/Admin/FeedOrdering";
import Analytics from "@/pages/Admin/Analytics";
import Settings from "@/pages/Admin/Settings";
import AllMedia from "@/pages/User/AllMedia";
import Sittings from "@/pages/User/Sittings";

import About from "@/pages/About";
import TermsOfService from "@/pages/About/TermsOfService";
import PrivacyPolicy from "@/pages/About/PrivacyPolicy";
import CookiePolicy from "@/pages/About/CookiePolicy";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/cookies",
        element: <CookiePolicy />,
      },


      {
        path: "",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          { path: "", element: <AllMedia /> },
          { path: "all", element: <AllMedia /> },
          { path: "videos", element: <Videos /> },
          { path: "photos", element: <Photos /> },
          { path: "favorites", element: <Favorites /> },
          { path: "settings", element: <Sittings /> },
          { path: "categories", element: <Categories /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminRoute />, // This will check if the user is an admin
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "", element: <Overview /> },
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

export default routes;
