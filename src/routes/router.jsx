import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/shared/home/Home";
import Authlayout from "../layouts/Authlayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import BeACreator from "../pages/dashboard/BeACreator";
import CreateAClub from "../pages/dashboard/CreateAClub";
import DashboardLayout from "../layouts/DashboardLayout";
import MyClubs from "../pages/dashboard/MyClubs";
import Payment from "../pages/Payment";
import ApproveClubManager from "../pages/dashboard/ApproveClubManager";
import UsersManagement from "../pages/dashboard/UsersManagement";
import AdminRoutes from "./AdminRoutes";

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
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),

    children: [
      {
        path: "my-clubs",
        element: <MyClubs></MyClubs>,
      },
      {
        path: "payment",
        element: <Payment></Payment>,
      },
      {
        path: "be-a-creator",
        element: <BeACreator></BeACreator>,
      },
      {
        path: "club-manager-approvals",
        element: (
          <AdminRoutes>
            <ApproveClubManager></ApproveClubManager>
          </AdminRoutes>
        ),
      },
      {
        path: "users-management",
        element: (
          <AdminRoutes>
            <UsersManagement></UsersManagement>
          </AdminRoutes>
        ),
      },
    ],
  },
]);
