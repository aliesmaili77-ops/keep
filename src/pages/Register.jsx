import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Calendar, Loader2, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [step, setStep] = useState(0); // 0: email, 1: password, 2: profile, 3: otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const returnTo = safeReturnTo();
  const loginLink =
    "/login" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "");

  const handleEmailNext = (e) => {
    e.preventDefault();
    setError("");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }
    setStep(1);
  };

  const handlePasswordNext = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setStep(2);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep(3);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
        try {
          await base44.auth.updateMe({
            display_name: name.trim(),
            date_of_birth: dob || undefined,
          });
        } catch {
          // best-effort profile update
        }
      }
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", returnTo);
  };

  // Step 0: Email
  if (step === 0) {
    return (
      <AuthLayout
        icon={Mail}
        title="Join Keep"
        subtitle="Enter your email to get started"
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
          className="w-full h-11 text-sm font-medium mb-6"
          onClick={handleGoogle}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">or</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-full bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailNext} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-medium">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // Step 1: Password
  if (step === 1) {
    return (
      <AuthLayout
        icon={Lock}
        title="Create a password"
        subtitle="Choose a secure password for your account"
        onBack={() => {
          setStep(0);
          setError("");
        }}
      >
        {error && (
          <div className="mb-4 p-3 rounded-full bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordNext} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                autoFocus
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-medium">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // Step 2: Profile (name + DOB)
  if (step === 2) {
    return (
      <AuthLayout
        icon={User}
        title="About you"
        subtitle="Tell us a bit about yourself"
        onBack={() => {
          setStep(1);
          setError("");
        }}
      >
        {error && (
          <div className="mb-4 p-3 rounded-full bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                autoFocus
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">
              Date of birth{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // Step 3: OTP
  return (
    <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a code to ${email}`}>
      {error && (
        <div className="mb-4 p-3 rounded-full bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-center mb-6">
        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={setOtpCode}
          autoFocus
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        className="w-full h-11 font-medium"
        onClick={handleVerify}
        disabled={loading || otpCode.length < 6}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Didn't receive the code?{" "}
        <button onClick={handleResend} className="text-primary font-medium hover:underline">
          Resend
        </button>
      </p>
    </AuthLayout>
  );
}