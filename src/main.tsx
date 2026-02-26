import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./components/ThemeToggle/theme-provider";
import routes from "./routes/Routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={routes} />
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
