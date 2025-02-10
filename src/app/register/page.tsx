"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import register from "@/lib/actions/register";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button>
      {pending ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" />
          <span>Please wait</span>
        </div>
      ) : (
        "Register"
      )}
    </Button>
  );
};

const initialState = {
  type: "",
  message: "",
};

const Register = () => {
  const [state, formAction] = useFormState(register, initialState);

  if (state.type === "success") {
    window.location.href = "/";
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <p
              aria-live="polite"
              className={`${
                state.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {state.message}
            </p>
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Robinson"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>
              <SubmitButton />
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/login-image.webp"
          width={1920}
          height={1080}
          style={{ objectFit: "cover" }}
          alt="Image"
          className="h-screen"
        />
      </div>
    </div>
  );
};

export default Register;
