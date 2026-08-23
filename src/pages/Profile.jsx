import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettingsList from "@/components/profile/SettingsList";
import KeepsGrid from "@/components/profile/KeepsGrid";
import { useTheme } from "@/lib/ThemeContext";
import { useKeeps } from "@/hooks/useKeeps";
import { useCircles } from "@/hooks/useCircles";
import {
  Bell,
  Shield,
  Moon,
  Sun,
  HelpCircle,
  FileText,
  Lock,
  LogOut,
  User,
  Trash2,
  MessageCircle,
  Search,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, setTheme, toggleTheme, isDark } = useTheme();
  const { data: keeps } = useKeeps();
  const { data: circles } = useCircles();

  const stats = [
    { label: "Keeps", value: keeps?.length || 0 },
    { label: "Circles", value: circles?.length || 0 },
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
      label: "Use system setting",
      icon: Sun,
      toggle: true,
      toggleValue: mode === "system",
      onToggle: () => setTheme(mode === "system" ? (isDark ? "dark" : "light") : "system"),
    },
    {
      label: "Dark mode",
      icon: Moon,
      toggle: true,
      toggleValue: isDark,
      onToggle: toggleTheme,
      toggleDisabled: mode === "system",
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

      {/* Search */}
      <div className="mt-6 mx-4">
        <div className="glass-tight flex items-center gap-2 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search settings"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-2">
        <SettingsList title="Account" items={accountItems} />
        <SettingsList title="Notifications" items={notificationItems} />
        <SettingsList title="Privacy & Safety" items={privacyItems} />
        <SettingsList title="Appearance" items={appearanceItems} />
        <SettingsList title="Support" items={supportItems} />
      </div>

      {/* Log out */}
      <div className="mt-5 mx-4">
        <button
          className="glass-tight w-full rounded-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-destructive active:scale-[0.98] transition-transform"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">Keep v1.0.0</p>
    </div>
  );
}