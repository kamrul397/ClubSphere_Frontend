import { createBrowserRouter, Outlet } from "react-router";

import Rootlayout from "../layouts/Rootlayout";
import Authlayout from "../layouts/Authlayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/shared/home/Home";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";
import ClubManagerRoutes from "./ClubManagerRoutes";

import BeACreator from "../pages/dashboard/BeACreator";
import Payment from "../pages/Payment";

import MemberOverview from "../pages/dashboard/membersPage/MemberOverview";
import MyJoinedClubs from "../pages/dashboard/membersPage/MyJoinedClubs";
import AllClubs from "../pages/dashboard/membersPage/AllClubs";
import AllEvents from "../pages/dashboard/membersPage/AllEvents";
import EventDetails from "../pages/dashboard/membersPage/EventDetails";
import MemberJoinedEvents from "../pages/dashboard/membersPage/MemberJoinedEvents";

import ManagerOverview from "../pages/dashboard/managerPage/ManagerOverview";
import MyClubs from "../pages/dashboard/MyClubs";
import ClubForm from "../pages/dashboard/managerPage/ClubForm";
import ManageClubMembers from "../pages/dashboard/managerPage/ManageClubMembers";
import ManageEvents from "../pages/dashboard/managerPage/ManageEvents";
import CreateEvent from "../pages/dashboard/managerPage/CreateEvent";
import EventParticipants from "../pages/dashboard/managerPage/EventParticipants";

import ApproveClubManager from "../pages/dashboard/ApproveClubManager";
import UsersManagement from "../pages/dashboard/UsersManagement";
import ApproveClubs from "../pages/dashboard/adminPage/ApproveClubs";
import ClubDetails from "../pages/ClubDetails";
import Profile from "../pages/shared/Profile";
import AdminOverview from "../pages/dashboard/adminPage/AdminOverview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "club-details/:id",
        element: <ClubDetails />,
      },
      {
        path: "all-clubs",
        element: <AllClubs />,
      },

      // Public: everyone can see all event list
      {
        path: "all-events",
        element: <AllEvents />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },

      // Private: user must login to see event details
      {
        path: "events/:id",
        element: (
          <PrivateRoutes>
            <EventDetails />
          </PrivateRoutes>
        ),
      },
    ],
  },

  {
    path: "/",
    element: <Authlayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      // Common / Member routes
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "be-a-creator",
        element: <BeACreator />,
      },
      {
        path: "member",
        element: <MemberOverview />,
      },
      {
        path: "my-joined-clubs",
        element: <MyJoinedClubs />,
      },
      {
        path: "member-joined-events",
        element: <MemberJoinedEvents />,
      },

      // Club Manager routes
      {
        path: "manager-overview",
        element: (
          <ClubManagerRoutes>
            <ManagerOverview />
          </ClubManagerRoutes>
        ),
      },
      {
        path: "create-a-club",
        element: (
          <ClubManagerRoutes>
            <ClubForm />
          </ClubManagerRoutes>
        ),
      },
      {
        path: "edit-club/:id",
        element: (
          <ClubManagerRoutes>
            <ClubForm />
          </ClubManagerRoutes>
        ),
      },
      {
        path: "my-clubs",
        element: (
          <ClubManagerRoutes>
            <Outlet />
          </ClubManagerRoutes>
        ),
        children: [
          {
            index: true,
            element: <MyClubs />,
          },
          {
            path: "manage-club-members/:clubId",
            element: <ManageClubMembers />,
          },
          {
            path: "manage-events/:clubId",
            element: <ManageEvents />,
          },
          {
            path: "create-event/:clubId",
            element: <CreateEvent />,
          },
          {
            path: "edit-event/:eventId",
            element: <CreateEvent />,
          },
          {
            path: "event-participants/:eventId",
            element: <EventParticipants />,
          },
        ],
      },

      // Admin routes
      {
        path: "club-manager-approvals",
        element: (
          <AdminRoutes>
            <ApproveClubManager />
          </AdminRoutes>
        ),
      },
      {
        path: "users-management",
        element: (
          <AdminRoutes>
            <UsersManagement />
          </AdminRoutes>
        ),
      },
      {
        path: "manage-clubs",
        element: (
          <AdminRoutes>
            <ApproveClubs />
          </AdminRoutes>
        ),
      },
      {
        path: "admin-overview",
        element: (
          <AdminRoutes>
            <AdminOverview></AdminOverview>
          </AdminRoutes>
        ),
      },
    ],
  },
]);
