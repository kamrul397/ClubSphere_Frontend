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
import MemberOverview from "../pages/dashboard/membersPage/MemberOverview";
import MyJoinedClubs from "../pages/dashboard/membersPage/MyJoinedClubs";
import RegisteredEvents from "../pages/dashboard/membersPage/RegisteredEvents";
import ManagerOverview from "../pages/dashboard/managerPage/ManagerOverview";
import EventsManagement from "../pages/dashboard/managerPage/EventsManagement";
import ClubManagerRoutes from "./ClubManagerRoutes";
import ApproveClubs from "../pages/dashboard/adminPage/ApproveClubs";
import ClubDetails from "../pages/ClubDetails";
import AllClubs from "../pages/dashboard/membersPage/AllClubs";

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
        path: "club-details/:id",
        element: <ClubDetails></ClubDetails>,
      },
      {
        path: "all-clubs",
        element: <AllClubs></AllClubs>,
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
        path: "payment",
        element: <Payment></Payment>,
      },
      {
        path: "be-a-creator",
        element: <BeACreator></BeACreator>,
      },
      {
        path: "member",
        element: <MemberOverview></MemberOverview>,
      },
      {
        path: "my-joined-clubs",
        element: <MyJoinedClubs></MyJoinedClubs>,
      },
      {
        path: "my-events",
        element: <RegisteredEvents></RegisteredEvents>,
      },
      {
        path: "my-clubs",
        element: (
          <ClubManagerRoutes>
            <MyClubs></MyClubs>,
          </ClubManagerRoutes>
        ),
      },
      {
        path: "manager",
        element: (
          <ClubManagerRoutes>
            <ManagerOverview></ManagerOverview>
          </ClubManagerRoutes>
        ),
      },
      {
        path: "create-a-club",
        element: (
          <ClubManagerRoutes>
            <CreateAClub></CreateAClub>
          </ClubManagerRoutes>
        ),
      },
      {
        path: "events-management",
        element: (
          <ClubManagerRoutes>
            <EventsManagement></EventsManagement>
          </ClubManagerRoutes>
        ),
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
      {
        path: "manage-clubs",
        element: (
          <AdminRoutes>
            <ApproveClubs></ApproveClubs>
          </AdminRoutes>
        ),
      },
    ],
  },
]);
