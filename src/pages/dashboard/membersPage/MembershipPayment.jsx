import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCircleCheck,
  FaCreditCard,
  FaLayerGroup,
  FaLocationDot,
} from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import MembershipPaymentForm from "./MembershipPaymentForm";
import useAuth from "../../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const MembershipPayment = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get the logged-in user

  console.log("user", user);

  const [clientSecret, setClientSecret] = useState("");

  const { data: club = {}, isLoading: clubLoading } = useQuery({
    queryKey: ["membershipPaymentClub", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubId}`);
      return res.data;
    },
    enabled: !!clubId,
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!clubId) return;

      try {
        const res = await axiosSecure.post(
          "/create-membership-payment-intent",
          {
            clubId,
          },
        );

        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [axiosSecure, clubId]);

  if (clubLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const amount = Number(club.membershipFee || 0);

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      <div className="shrink-0 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#17203a] to-[#3a2348] p-[1px] shadow-xl">
          <div className="relative rounded-3xl bg-slate-900/90 p-5 md:p-6 text-white">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/25 blur-3xl"></div>
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Secure Membership Payment
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  Complete Your Club Membership
                </h1>

                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  Pay the membership fee securely to join this club.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"
              >
                <FaArrowLeft />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1 space-y-4">
            <div className="rounded-[2rem] border border-base-200 bg-base-100 p-5 shadow-sm">
              <div className="overflow-hidden rounded-2xl border border-base-200 h-44 bg-base-200">
                {club.bannerImage ? (
                  <img
                    src={club.bannerImage}
                    alt={club.clubName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary">
                    <FaLayerGroup className="text-4xl" />
                  </div>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-black text-base-content">
                {club.clubName}
              </h2>

              <p className="mt-2 text-sm text-base-content/60 line-clamp-3">
                {club.description || "No description available."}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <FaLocationDot className="text-primary" />
                  {club.location || "No location"}
                </p>

                <p className="flex items-center gap-2">
                  <FaCircleCheck className="text-success" />
                  Approved Club
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/20 bg-primary/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Payable Amount
              </p>
              <p className="mt-1 text-4xl font-black text-primary">${amount}</p>
              <p className="mt-2 text-xs text-base-content/60">
                This payment creates an active membership for your account.
              </p>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-[2rem] border border-base-200 bg-base-100 p-5 md:p-7 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">
                  <FaCreditCard />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-base-content">
                    Payment Details
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Enter test card information to complete the payment.
                  </p>
                </div>
              </div>

              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                  }}
                >
                  <MembershipPaymentForm clubId={clubId} user={user} />
                </Elements>
              ) : (
                <div className="py-12 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="mt-3 text-sm text-base-content/60">
                    Preparing secure payment...
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-base-200 bg-base-200/50 p-4 text-sm text-base-content/60">
                Test mode: use Stripe test card{" "}
                <span className="font-bold text-base-content">
                  4242 4242 4242 4242
                </span>{" "}
                with any future expiry date and any CVC. Stripe documents this
                card as a successful test payment card.
                :contentReference[oaicite:1]{}
              </div>

              <div className="mt-4">
                <Link to="/all-clubs" className="btn btn-outline btn-sm">
                  Browse Clubs
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default MembershipPayment;
