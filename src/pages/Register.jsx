import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import AppleIcon from "@/components/AppleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const returnTo = safeReturnTo();
  const loginLink =
    "/login" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "");

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", returnTo);
  };

  const handleApple = () => {
    base44.auth.loginWithProvider("apple", returnTo);
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Join Keep"
      subtitle="Start keeping your moments"
      footer={
        <>
          Already have an account?{" "}
          <Link to={loginLink} className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium mb-3"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium mb-6"
        onClick={handleApple}
      >
        <AppleIcon className="w-5 h-5 mr-2" />
        Continue with Apple
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link to="/privacy" className="underline">Privacy Policy</Link>
        {" "}and{" "}
        <Link to="/terms" className="underline">Terms</Link>.
      </p>
    </AuthLayout>
  );
}