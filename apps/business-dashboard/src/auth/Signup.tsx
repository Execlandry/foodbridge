"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";

const fields = signupFields;
let fieldsState: Record<string, string> = { role: "Restaurant" }; // Set default role

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Signup() {
  const { data: session } = useSession();
  const user = session?.user;
  const [signupState, setSignupState] = useState(fieldsState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value });
  };

  const authenticateUser = async () => {
    await signIn("credentials", {
      redirect: false,
      email: signupState.email,
      password: signupState.password,
      callbackUrl: `${window.location.origin}/dashboard`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupState),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Signup failed");
      }

      const userData = await response.json();
      console.log("User registered successfully:", userData);

      await authenticateUser();
      router.push("/dashboard/businesses");
    } catch (error: any) {
      setError(error.message);
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Create an Account
        </h2>

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}

          <FormAction
            handleSubmit={handleSubmit}
            text={loading ? "Signing up..." : "Signup"}
          />
        </form>

        {/* <p className="mt-4 text-gray-600 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p> */}
      </div>
    </div>
  );
}
