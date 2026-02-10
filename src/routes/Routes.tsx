import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../components/authentication/pages/About";
import Contact from "../components/authentication/pages/Contact";
import NotFound from "../components/authentication/pages/NotFound";
import Home from "../components/authentication/pages/Home";
import AdminRoute from "./AdminRoutes";
import Login from "@/components/authentication/pages/Login";
import Signup from "@/components/authentication/pages/Signup";
import Services from "@/components/authentication/pages/Services";
import UserLayout from "@/Layout/UserLayout/UserLayout";
import All from "@/components/authentication/pages/User/All";
import Videos from "@/components/authentication/pages/User/Videos";
import Photos from "@/components/authentication/pages/User/Photos";
import Favorites from "@/components/authentication/pages/User/Favorites";
import TopCasinos from "@/components/authentication/pages/User/TopCasinos";
import AdminLayout from "@/Layout/AdminLayout/AdminLayout";
import Overview from "@/components/authentication/pages/Admin/Overview";
import FeedOrdering from "@/components/authentication/pages/Admin/FeedOrdering";
import Analytics from "@/components/authentication/pages/Admin/Analytics";
import Settings from "@/components/authentication/pages/Admin/Settings";

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
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
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
          { path: "", element: <All /> },
          { path: "all", element: <All /> },
          { path: "videos", element: <Videos /> },
          { path: "photos", element: <Photos /> },
          { path: "favorites", element: <Favorites /> },
          { path: "top-casinos", element: <TopCasinos /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminRoute />, // This will check if the user is an admin
        children: [
          {
            path: "",
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
