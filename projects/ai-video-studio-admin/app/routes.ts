import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import CreateWizard from "./components/CreateWizard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/create",
    Component: CreateWizard,
  },
]);
