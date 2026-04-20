import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/shared/home/Home";
import Authlayout from "../layouts/Authlayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import BeACreator from "../components/BeACreator";
import CreateAClub from "../components/CreateAClub";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout></Rootlayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "be-a-creator",
        element: (
          <PrivateRoutes>
            <BeACreator></BeACreator>
          </PrivateRoutes>
        ),
      },
      {
        path: "create-a-club",
        element: (
          <PrivateRoutes>
            <CreateAClub></CreateAClub>
          </PrivateRoutes>
        ),
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
