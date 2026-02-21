import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import UserLayout from "@/Layout/UserLayout/UserLayout";
import AllMedia from "@/pages/User/AllMedia";
import Videos from "@/pages/User/Videos";
import Photos from "@/pages/User/Photos";
import Favorites from "@/pages/User/Favorites";
import TopCasinos from "@/pages/User/TopCasinos";
// import Settings from "@/pages/User/Settings";

const publicRouter = createBrowserRouter([
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
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <AllMedia /> },
          { path: "all", element: <AllMedia /> },
          { path: "videos", element: <Videos /> },
          { path: "photos", element: <Photos /> },
          { path: "favorites", element: <Favorites /> },
          //   { path: "settings", element: <Settings /> },
          { path: "top-casinos", element: <TopCasinos /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default publicRouter;