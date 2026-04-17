import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/shared/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout></Rootlayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
    ],
  },
]);
