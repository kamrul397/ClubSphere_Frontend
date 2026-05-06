import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaCreditCard, FaLock } from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MembershipPaymentForm = ({ clubId, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);

  // console.log("user", user);
  console.log("user", user.displayName);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      setProcessing(true);

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        Swal.fire("Payment Failed", error.message, "error");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Send the payment information along with the user's name to the backend
        const res = await axiosSecure.post("/membership-payment-success", {
          clubId,
          paymentIntentId: paymentIntent.id,
          userName: user.displayName || "Guest", // Send the user's name (or fallback if not available)
        });

        if (res.data.success || res.data.alreadyMember) {
          Swal.fire({
            icon: "success",
            title: "Membership Activated",
            text: `You have successfully joined this club. Transaction ID: ${paymentIntent.id}`,
            timer: 1700,
            showConfirmButton: false,
          });

          // Redirect the user to their joined clubs page
          navigate("/dashboard/my-joined-clubs", { replace: true });
        }
      }
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Payment Error",
        error?.response?.data?.message ||
          "Could not complete membership payment.",
        "error",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="btn btn-primary w-full text-white"
      >
        {processing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing Payment...
          </>
        ) : (
          <>
            <FaCreditCard />
            Pay and Join Club
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-2 text-xs text-base-content/50">
        <FaLock />
        Secure payment powered by Stripe.
      </p>
    </form>
  );
};

export default MembershipPaymentForm;
