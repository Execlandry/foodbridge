"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "./convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3005/api/v1/Payouts/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setErrorMessage(undefined);
        } else {
          setErrorMessage("Failed to create payment intent.");
        }
      })
      .catch(() => {
        setErrorMessage("Error creating payment intent.");
      });
  }, [amount]);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Total", amount: convertToSubcurrency(amount) },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe, amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-md shadow-md border border-emerald-100">
      {paymentRequest && (
        <div className="mb-6">
          <PaymentRequestButtonElement
            options={{
              paymentRequest: paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "buy",
                  theme: "light", // changed to light for green accent compatibility
                  height: "48px",
                },
              },
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {clientSecret && <PaymentElement />}

        {errorMessage && (
          <div className="text-red-500 text-sm text-center">{errorMessage}</div>
        )}

        <button
          disabled={!stripe || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
