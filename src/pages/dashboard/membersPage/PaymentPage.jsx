import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MembershipPaymentForm from "./MembershipPaymentForm"; // Payment form for Stripe

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentPage = ({ user }) => {
  // Pass the actual user prop
  const { eventId } = useParams(); // Get the event ID from the URL
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the payment intent and other necessary data for the event
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch(`/create-event-payment-intent`, {
          method: "POST",
          body: JSON.stringify({ eventId }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent", error);
        setErrorMessage(
          "Failed to prepare the payment. Please try again later.",
        );
      }
    };

    fetchPaymentIntent();
  }, [eventId]);

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-base-200 p-6 md:p-8">
        <h2 className="text-3xl font-extrabold text-base-content mb-3">
          Complete Your Payment
        </h2>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <MembershipPaymentForm
              clubId={eventId}
              user={user} // Pass the actual user object
            />
          </Elements>
        ) : (
          <div className="py-12 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-3 text-sm text-base-content/60">
              Preparing payment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
