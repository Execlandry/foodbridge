"use client";

import CheckoutPage from "./CheckoutPage";
import convertToSubcurrency from "./convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FiDollarSign } from "react-icons/fi";

const stripePromise = loadStripe(
  "pk_test_51QivsQKPR8ckGMwqNue05fCy7quuwkAUGWzm3HirxDT3JJR9AQChu2otmRbpGlchO4c5OF0jolsbizTLRd3eYyRG006roNdD7F"
);

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [currency] = useState("usd");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState("");
  const inputControls = useAnimation();

  const handleAmountChange = (value: string) => {
    const parsed = parseFloat(value);
    if (value === "") {
      setAmount(0);
      setError("Amount is required.");
    } else if (isNaN(parsed) || parsed <= 0) {
      setAmount(0);
      setError("Please enter a valid amount greater than 0.");
    } else {
      setAmount(parsed);
      setError("");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <motion.div
        className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white border border-green-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-center text-green-700 mb-4">
          Secure Payment
        </h1>

        <div className="relative mb-2">
          <motion.div
            className={`flex items-center gap-2 border ${
              error ? "border-red-400" : "border-green-300"
            } p-2 rounded-md bg-green-50 focus-within:border-green-500 transition-all`}
            animate={inputControls}
          >
            {/* <FiDollarSign className="text-lg text-green-600" /> */}
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-transparent text-base text-green-900 placeholder-green-400 outline-none"
              min="1"
              step="1"
              placeholder="Enter amount"
              aria-label="Payment amount"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </motion.div>
          <AnimatePresence>
            {isInputFocused && !error && (
              <motion.p
                className="text-xs text-green-500 mt-1 ml-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                Enter the amount you wish to pay
              </motion.p>
            )}
          </AnimatePresence>
          {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
        </div>

        {amount > 0 && !error && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: currency,
            }}
          >
            <CheckoutPage amount={amount} />
          </Elements>
        )}

        <motion.p
          className="text-center text-xs text-green-600 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your payment is processed securely with{" "}
          <span className="font-medium text-green-800">Stripe</span>.
        </motion.p>
      </motion.div>
    </main>
  );
}
