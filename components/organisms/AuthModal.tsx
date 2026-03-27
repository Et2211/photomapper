"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ModalShell from "@/components/molecules/ModalShell";
import { createClient } from "@/lib/supabase-browser";
import { useAppDispatch } from "@/store";
import { setAuthOpen } from "@/store/uiSlice";


const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

interface AuthModalProps {
  isOpen: boolean;
}

const AuthModal = ({ isOpen }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => dispatch(setAuthOpen(false));

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          throw signInError;
        }

        handleClose();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (signUpError) {
          throw signUpError;
        }

        setSuccessMessage("Check your email to confirm your account, then log in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <ModalShell title={mode === "login" ? "Log in" : "Create account"} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
        <FormField label="Email" htmlFor="auth-email" error={errors.email?.message}>
          <Input {...register("email")} id="auth-email" type="email" autoComplete="email" placeholder="you@example.com" />
        </FormField>

        <FormField label="Password" htmlFor="auth-password" error={errors.password?.message}>
          <Input
            {...register("password")}
            id="auth-password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="••••••••"
          />
        </FormField>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
          {isLoading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={toggleMode} className="text-blue-600 hover:underline font-medium">
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </form>
    </ModalShell>
  );
};

export default AuthModal;
