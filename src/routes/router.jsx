import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/shared/home/Home";
import Authlayout from "../layouts/Authlayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

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
  {
    path: "/",
    element: <Authlayout></Authlayout>,
    children: [
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
    ],
  },
]);
