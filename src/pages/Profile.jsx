import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettingsList from "@/components/profile/SettingsList";
import KeepsGrid from "@/components/profile/KeepsGrid";
import {
  Bell,
  Shield,
  Moon,
  HelpCircle,
  FileText,
  Lock,
  LogOut,
  User,
  Trash2,
  MessageCircle,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const stats = [
    { label: "Keeps", value: 23 },
    { label: "Circles", value: 4 },
  ];

  const accountItems = [
    { label: "Edit name", icon: User, subtext: "Update your display name" },
    { label: "Change password", icon: Lock, subtext: "Update your password" },
    {
      label: "Delete account",
      icon: Trash2,
      danger: true,
      subtext: "Request permanent removal",
    },
  ];

  const notificationItems = [
    { label: "Keep reminders", icon: Bell, trailing: "Weekly" },
    { label: "Circle activity", icon: Bell, trailing: "On" },
    { label: "Reactions & comments", icon: MessageCircle, trailing: "On" },
  ];

  const privacyItems = [
    { label: "Blocked users", icon: Shield, subtext: "Manage who you've blocked" },
    { label: "Report a problem", icon: HelpCircle },
  ];

  const appearanceItems = [
    {
      label: "Dark mode",
      icon: Moon,
      trailing: darkMode ? "On" : "Off",
      onClick: () => setDarkMode((v) => !v),
    },
  ];

  const supportItems = [
    { label: "Help center", icon: HelpCircle },
    { label: "Terms of service", icon: FileText, onClick: () => navigate("/terms") },
    { label: "Privacy policy", icon: FileText, onClick: () => navigate("/privacy") },
  ];

  return (
    <div className="max-w-md mx-auto pb-32">
      <ProfileHeader user={user} stats={stats} />
      <KeepsGrid />

      <div className="mt-6">
        <SettingsList title="Account" items={accountItems} />
        <SettingsList title="Notifications" items={notificationItems} />
        <SettingsList title="Privacy & Safety" items={privacyItems} />
        <SettingsList title="Appearance" items={appearanceItems} />
        <SettingsList title="Support" items={supportItems} />
      </div>

      {/* Log out */}
      <div className="mt-5 mx-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">Keep v1.0.0</p>
    </div>
  );
}