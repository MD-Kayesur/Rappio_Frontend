import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import AdminRoute from "./AdminRoutes";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Services from "@/pages/Services";
import UserLayout from "@/Layout/UserLayout/UserLayout";
import All from "@/pages/User/All";
import Videos from "@/pages/User/Videos";
import Photos from "@/pages/User/Photos";
import Favorites from "@/pages/User/Favorites";
import TopCasinos from "@/pages/User/TopCasinos";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
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
          { path: "", element: <AdminDashboard /> }, // Admin Dashboard
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
