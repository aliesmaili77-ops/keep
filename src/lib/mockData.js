// Mock data for visual preview. Real data will come from entities in later stages.

export const mockCircles = [
  {
    id: "c1",
    name: "The Boys",
    circle_type: "close_friends",
    members: ["Danny", "Marcus", "Sam", "Leo"],
    keep_count: 12,
    last_activity: "2h ago",
  },
  {
    id: "c2",
    name: "Ali & Sara",
    circle_type: "partner",
    members: ["Ali", "Sara"],
    keep_count: 8,
    last_activity: "1d ago",
  },
  {
    id: "c3",
    name: "Poland Trip",
    circle_type: "close_friends",
    members: ["Marcus", "Danny", "Sam", "Leo"],
    keep_count: 15,
    last_activity: "5d ago",
  },
  {
    id: "c4",
    name: "Esmaeili Family",
    circle_type: "family",
    members: ["Saba", "Maman", "Baba", "Ali", "Sara"],
    keep_count: 20,
    last_activity: "3d ago",
  },
];

export const mockKeeps = [
  {
    id: "k1",
    keep_type: "quote",
    text: "I'm not saying I'm Batman, but nobody has ever seen me and Batman in the same room.",
    speaker_name: "Danny",
    context: "After three beers at trivia night",
    circle_name: "The Boys",
    circle_id: "c1",
    happened_at: "2026-08-10",
    kept_by: "Marcus",
    reactions: [
      { type: "laugh", count: 3, users: ["Danny", "Marcus", "Sam"] },
      { type: "heart", count: 1, users: ["Sam"] },
    ],
    comments: [
      { user: "Sam", text: "He said this with complete seriousness" },
    ],
  },
  {
    id: "k2",
    keep_type: "quote",
    text: "سبا گفت: من فکر کردم این دکمه برای خاموش کردن اینترنت کل خونه‌ست.",
    speaker_name: "Saba",
    context: "وقتی دکمه اشتباه رو زد",
    circle_name: "Ali & Sara",
    circle_id: "c2",
    happened_at: "2026-08-08",
    kept_by: "Ali",
    is_rtl: true,
    reactions: [
      { type: "laugh", count: 2, users: ["Ali", "Sara"] },
    ],
    comments: [],
  },
  {
    id: "k3",
    keep_type: "voice",
    text: "The story of how we missed the last train in Krakow",
    speaker_name: "Marcus",
    circle_name: "Poland Trip",
    circle_id: "c3",
    happened_at: "2026-07-22",
    kept_by: "Marcus",
    duration: 142,
    reactions: [
      { type: "heart", count: 2, users: ["Danny", "Sam"] },
      { type: "laugh", count: 1, users: ["Leo"] },
    ],
    comments: [
      { user: "Danny", text: "I still can't believe we made that flight" },
    ],
  },
  {
    id: "k4",
    keep_type: "memory",
    title: "First trip together",
    text: "Poland, 2026. We got lost in Krakow's old town for two hours, found the best pierogi of our lives, and missed the last train back to Warsaw. Slept on a bench in the station and caught the 5am train. Best trip ever.",
    circle_name: "Ali & Sara",
    circle_id: "c2",
    happened_at: "2026-07-20",
    kept_by: "Sara",
    milestone_tag: "first trip",
    reactions: [
      { type: "heart", count: 1, users: ["Ali"] },
    ],
    comments: [],
  },
  {
    id: "k5",
    keep_type: "memory",
    text: "Dad burned the rice again. Third time this month. Mom just laughed and ordered pizza. He insists the flame was too high.",
    speaker_name: null,
    circle_name: "Esmaeili Family",
    circle_id: "c4",
    happened_at: "2026-08-15",
    kept_by: "Saba",
    reactions: [
      { type: "laugh", count: 2, users: ["Maman", "Baba"] },
    ],
    comments: [
      { user: "Maman", text: "It was definitely the flame 😂" },
    ],
  },
];

export const resurfacedKeep = {
  id: "r1",
  keep_type: "quote",
  text: "If we order one more pizza, I'm legally changing my name to Domino's.",
  speaker_name: "Leo",
  circle_name: "The Boys",
  circle_id: "c1",
  happened_at: "2026-06-15",
  kept_by: "Sam",
};

export const reactionEmojis = {
  heart: "❤️",
  laugh: "😂",
  wow: "😮",
  sad: "😢",
  fire: "🔥",
};

export function formatKeepDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}