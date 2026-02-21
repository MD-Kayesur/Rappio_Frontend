import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const isAdmin = true; // replace with Redux or auth logic

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoutes;

// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store/store";

// const AdminRoute = () => {
//   const user = useSelector((state: RootState) => state.auth.user);

//   // Check if the user is logged in and is an admin
//   if (!user || user.role !== "admin") {
//     console.log("AdminRoute: Access denied", user);
//     return <Navigate to="/signup" replace />;
//   }

//   console.log("AdminRoute: Access granted", user);

//   return <Outlet />;
// };

// export default AdminRoute;
