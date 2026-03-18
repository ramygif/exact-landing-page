import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Success } from "./pages/Success";
import { Confidentialite } from "./pages/Confidentialite";
import { CGU } from "./pages/CGU";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/auth", Component: Auth },
  { path: "/register", Component: Auth },
  { path: "/login", Component: Auth },
  { path: "/dashboard", Component: Dashboard },
  { path: "/success", Component: Success },
  { path: "/confidentialite", Component: Confidentialite },
  { path: "/cgu", Component: CGU },
]);
