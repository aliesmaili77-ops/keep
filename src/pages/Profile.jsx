import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettingsList from "@/components/profile/SettingsList";
import KeepsGrid from "@/components/profile/KeepsGrid";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import ChangePasswordSheet from "@/components/profile/ChangePasswordSheet";
import DeleteAccountSheet from "@/components/profile/DeleteAccountSheet";
import BlockedUsersSheet from "@/components/profile/BlockedUsersSheet";
import ReportProblemSheet from "@/components/profile/ReportProblemSheet";
import HelpCenterSheet from "@/components/profile/HelpCenterSheet";
import { useTheme } from "@/lib/ThemeContext";
import { useKeeps } from "@/hooks/useKeeps";
import { usePeople } from "@/hooks/usePeople";
import { base44 } from "@/api/base44Client";
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
  const { user, logout, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mode, setTheme, toggleTheme, isDark } = useTheme();
  const { data: keeps } = useKeeps();
  const { data: people } = usePeople();
  const [activeSheet, setActiveSheet] = useState(null);
  const [search, setSearch] = useState("");

  const prefs =
    user?.notification_prefs || {
      keep_reminders: true,
      circle_activity: true,
      reactions_comments: true,
    };

  const updatePref = async (key, value) => {
    try {
      await base44.auth.updateMe({
        notification_prefs: { ...prefs, [key]: value },
      });
      await checkUserAuth();
    } catch (e) {
      toast({ title: "Couldn't update preference", variant: "destructive" });
    }
  };

  const stats = [
    { label: "Keeps", value: keeps?.length || 0 },
    {
      label: "People",
      value: people?.filter((p) => p.user_id !== user?.id).length || 0,
    },
  ];

  const accountItems = [
    {
      label: "Edit name",
      icon: User,
      subtext: "Update your display name",
      onClick: () => setActiveSheet("edit"),
    },
    {
      label: "Change password",
      icon: Lock,
      subtext: "Update your password",
      onClick: () => setActiveSheet("password"),
    },
    {
      label: "Delete account",
      icon: Trash2,
      danger: true,
      subtext: "Request permanent removal",
      onClick: () => setActiveSheet("delete"),
    },
  ];

  const notificationItems = [
    {
      label: "Keep reminders",
      icon: Bell,
      toggle: true,
      toggleValue: prefs.keep_reminders,
      onToggle: (v) => updatePref("keep_reminders", v),
    },
    {
      label: "Circle activity",
      icon: Bell,
      toggle: true,
      toggleValue: prefs.circle_activity,
      onToggle: (v) => updatePref("circle_activity", v),
    },
    {
      label: "Reactions & comments",
      icon: MessageCircle,
      toggle: true,
      toggleValue: prefs.reactions_comments,
      onToggle: (v) => updatePref("reactions_comments", v),
    },
  ];

  const privacyItems = [
    {
      label: "Blocked users",
      icon: Shield,
      subtext: "Manage who you've blocked",
      onClick: () => setActiveSheet("blocked"),
    },
    {
      label: "Report a problem",
      icon: HelpCircle,
      onClick: () => setActiveSheet("report"),
    },
  ];

  const appearanceItems = [
    {
      label: "Use system setting",
      icon: Sun,
      toggle: true,
      toggleValue: mode === "system",
      onToggle: () =>
        setTheme(mode === "system" ? (isDark ? "dark" : "light") : "system"),
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
    { label: "Help center", icon: HelpCircle, onClick: () => setActiveSheet("help") },
    { label: "Terms of service", icon: FileText, onClick: () => navigate("/terms") },
    { label: "Privacy policy", icon: FileText, onClick: () => navigate("/privacy") },
  ];

  const allSections = useMemo(
    () => [
      { title: "Account", items: accountItems },
      { title: "Notifications", items: notificationItems },
      { title: "Privacy & Safety", items: privacyItems },
      { title: "Appearance", items: appearanceItems },
      { title: "Support", items: supportItems },
    ],
    [mode, isDark, prefs] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filteredSections = search.trim()
    ? allSections
        .map((s) => ({
          ...s,
          items: s.items.filter((i) =>
            i.label.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((s) => s.items.length > 0)
    : allSections;

  return (
    <div className="max-w-md mx-auto pb-32">
      <ProfileHeader
        user={user}
        stats={stats}
        onEdit={() => setActiveSheet("edit")}
      />
      <KeepsGrid />

      {/* Search */}
      <div className="mt-6 mx-4">
        <div className="glass-tight flex items-center gap-2 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search settings"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-2">
        {filteredSections.map((section) => (
          <SettingsList key={section.title} title={section.title} items={section.items} />
        ))}
        {filteredSections.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-10">
            No settings found for "{search}"
          </p>
        )}
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

      {/* Sheets */}
      <EditProfileSheet
        open={activeSheet === "edit"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
      />
      <ChangePasswordSheet
        open={activeSheet === "password"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
      />
      <DeleteAccountSheet
        open={activeSheet === "delete"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
        onDeleted={() => logout()}
      />
      <BlockedUsersSheet
        open={activeSheet === "blocked"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
      />
      <ReportProblemSheet
        open={activeSheet === "report"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
      />
      <HelpCenterSheet
        open={activeSheet === "help"}
        onOpenChange={(o) => !o && setActiveSheet(null)}
      />
    </div>
  );
}