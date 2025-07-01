"use client";

import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccess = () => {
  const [amount, setAmount] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setAmount(params.get("amount") || "");
    setPaymentIntent(params.get("payment_intent") || "");
    setClientSecret(params.get("payment_intent_client_secret") || "");
    setStatus(params.get("redirect_status") || "");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <section className="bg-white max-w-md w-full rounded-3xl p-10 shadow-lg flex flex-col items-center text-center">
        <FiCheckCircle
          className="text-green-500 w-20 h-20 mb-6 animate-pulse"
          aria-hidden="true"
        />

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          You’ve donated{" "}
          <span className="font-semibold text-green-600">${amount}</span>. Thank
          you!
        </p>

        <div className="w-full text-left space-y-2 mb-8">
          <p className="text-sm text-green-700 font-semibold">
            Payment Details
          </p>
          <p className="text-sm text-gray-500 break-words">
            <span className="font-medium text-gray-700">Payment Intent: </span>
            {paymentIntent || "N/A"}
          </p>
          <p className="text-sm text-gray-500 break-words">
            <span className="font-medium text-gray-700">Client Secret: </span>
            {clientSecret || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Status: </span>
            {status || "N/A"}
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="inline-block bg-green-600 hover:bg-green-700 text-white rounded-full px-12 py-3 font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="Go to Dashboard"
        >
          Go to Dashboard
        </button>
      </section>
    </main>
  );
};

export default PaymentSuccess;
