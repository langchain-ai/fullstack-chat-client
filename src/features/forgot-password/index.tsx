"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from "@/providers/Auth";

export default function ForgotPasswordInterface() {
  const { resetPassword } = useAuthContext();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="mb-4">
              <AlertDescription>
                If your email address is associated with an account, you will
                receive an email with instructions to reset your password
                shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link
              href="/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
