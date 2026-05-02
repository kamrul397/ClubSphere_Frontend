import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/shared/home/Home";
import Authlayout from "../layouts/Authlayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import BeACreator from "../pages/dashboard/BeACreator";

import DashboardLayout from "../layouts/DashboardLayout";
import MyClubs from "../pages/dashboard/MyClubs";
import Payment from "../pages/Payment";
import ApproveClubManager from "../pages/dashboard/ApproveClubManager";
import UsersManagement from "../pages/dashboard/UsersManagement";
import AdminRoutes from "./AdminRoutes";
import MemberOverview from "../pages/dashboard/membersPage/MemberOverview";
import MyJoinedClubs from "../pages/dashboard/membersPage/MyJoinedClubs";

import ManagerOverview from "../pages/dashboard/managerPage/ManagerOverview";

import ClubManagerRoutes from "./ClubManagerRoutes";
import ApproveClubs from "../pages/dashboard/adminPage/ApproveClubs";
import ClubDetails from "../pages/ClubDetails";
import AllClubs from "../pages/dashboard/membersPage/AllClubs";
import ManageClubMembers from "../pages/dashboard/managerPage/ManageClubMembers";

import ManageEvents from "../pages/dashboard/managerPage/ManageEvents";
import EditClub from "../pages/dashboard/managerPage/EditClub";
import ClubForm from "../pages/dashboard/managerPage/ClubForm";
import CreateEvent from "../pages/dashboard/managerPage/CreateEvent";
import MyEvents from "../pages/dashboard/managerPage/MyEvents";
import AllEvents from "../pages/dashboard/membersPage/AllEvents";
import EventDetails from "../pages/dashboard/membersPage/EventDetails";
import MemberJoinedEvents from "../pages/dashboard/membersPage/MemberJoinedEvents";
import EventParticipants from "../pages/dashboard/managerPage/EventParticipants";

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
      {
        path: "all-events",
        element: <AllEvents></AllEvents>,
      },
      {
        path: "events/:id", // This :id will be the clubId from your event
        element: <EventDetails></EventDetails>,
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
        path: "member-joined-events",
        element: <MemberJoinedEvents></MemberJoinedEvents>,
      },

      {
        path: "my-clubs",
        element: (
          <ClubManagerRoutes>
            {/* Use a wrapper or ensure MyClubs handles child rendering if needed */}
            <MyClubs />
          </ClubManagerRoutes>
        ),
        children: [
          {
            // This will match /dashboard/my-clubs/manage-club-members/:clubId
            path: "manage-club-members/:clubId",
            element: <ManageClubMembers />,
          },
          {
            // Match exactly /dashboard/my-clubs/manage-club-members
            path: "manage-club-members",
            element: <ManageClubMembers />,
          },
          {
            path: "manage-events/:clubId",
            element: <ManageEvents></ManageEvents>,
          },
          // router.js
          {
            path: "create-event/:clubId", // For New
            element: <CreateEvent />,
          },
          {
            path: "edit-event/:eventId", // For Edit
            element: <CreateEvent />,
          },
          {
            path: "event-participants/:eventId",
            element: <EventParticipants />,
          },
        ],
      },
      {
        path: "manager-overview",
        element: <ManagerOverview></ManagerOverview>,
      },
      {
        path: "my-events",
        element: <MyEvents></MyEvents>,
      },

      {
        path: "create-a-club",
        element: (
          <ClubManagerRoutes>
            <ClubForm />
          </ClubManagerRoutes>
        ),
      },
      // Route for EDITING an existing club
      {
        path: "edit-club/:id",
        element: (
          <ClubManagerRoutes>
            <ClubForm />
          </ClubManagerRoutes>
        ),
      },

      // {
      //   path: "manage-club-members/:clubId",
      //   element: (
      //     <ClubManagerRoutes>
      //       <ManageClubMembers></ManageClubMembers>
      //     </ClubManagerRoutes>
      //   ),
      // },
      // {
      //   path: "events-management",
      //   element: (
      //     <ClubManagerRoutes>
      //       <EventsManagement></EventsManagement>
      //     </ClubManagerRoutes>
      //   ),
      // },
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
