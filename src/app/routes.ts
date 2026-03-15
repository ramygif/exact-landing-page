import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Confidentialite } from "./pages/Confidentialite";
import { CGU } from "./pages/CGU";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/confidentialite",
    Component: Confidentialite,
  },
  {
    path: "/cgu",
    Component: CGU,
  },
]);
