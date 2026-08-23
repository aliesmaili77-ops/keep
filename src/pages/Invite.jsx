import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, CheckCircle, XCircle, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Invite() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { isLoadingAuth, user } = useAuth();
  const [status, setStatus] = useState("loading");
  const [circle, setCircle] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isLoadingAuth) return;

    if (!user) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMsg("No invitation token found.");
      return;
    }

    const accept = async () => {
      try {
        const res = await base44.functions.invoke("acceptInvite", { token });
        setCircle(res.data.circle);
        setStatus(res.data.alreadyMember ? "already" : "success");
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || "Something went wrong";
        setErrorMsg(msg);
        setStatus("error");
      }
    };
    accept();
  }, [isLoadingAuth, user, token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoadingAuth || status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">
          {isLoadingAuth ? "Loading..." : "Joining Circle..."}
        </p>
      </div>
    );
  }

  if (status === "success" || status === "already") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-primary" strokeWidth={2} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          {status === "already" ? "You're already in!" : "You're in!"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {status === "already"
            ? `You're already a member of ${circle?.name}`
            : `You've joined ${circle?.name}`}
        </p>
        <Button className="mt-6" size="lg" onClick={() => navigate(`/circle/${circle?.id}`)}>
          Open Circle
        </Button>
      </div>
    );
  }

  // error
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-destructive" strokeWidth={2} />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Couldn't join</h1>
      <p className="text-muted-foreground text-sm mt-1 max-w-xs">{errorMsg}</p>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Button>
    </div>
  );
}