import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./components/ThemeToggle/theme-provider";

import publicRouter from "./routes/PublicRoutes";
// import adminRouter from "./routes/AdminRoutes";
import adminRouter from "./routes/AdminOwnRoute";

// const hostname = window.location.hostname;

// // Detect admin domain properly
// const isAdminDomain =
//   hostname === "admin.yourdomain.com" ||
//   hostname.startsWith("admin.") ||
//   hostname.includes("localhost"); // remove in production if needed


/* part-2 */

// const hostname = window.location.hostname;
// const port = window.location.port;

// const isAdminDomain =
//   hostname.startsWith("/admin.") ||
//   port === "5174"; // example admin port

// const router = isAdminDomain ? adminRouter : publicRouter;


const isAdminRoute = window.location.pathname.startsWith("/admin");
const router = isAdminRoute ? adminRouter : publicRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);


// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { RouterProvider } from "react-router-dom";
// import routes from "./routes/Routes.tsx";
// import { Provider } from "react-redux";
// import { store } from "./store/store.ts";

// import { ThemeProvider } from "./components/ThemeToggle/theme-provider.tsx";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Provider store={store}>
//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//         <RouterProvider router={routes} />
//       </ThemeProvider>
//     </Provider>
//   </StrictMode>
// );
