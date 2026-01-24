import {
  Users,
  FileText,
  BarChart3,
  Music,
  Disc3,
  User,
  Tag,
  Video,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    name: "Ping Statistics",
    items: [
      {
        path: "/admin/statistics",
        label: "Thống kê",
        icon: BarChart3,
      },
    ],
  },
  {
    name: "Ping Profile",
    items: [
      {
        path: "/admin/accounts",
        label: "Quản lý tài khoản",
        icon: Users,
      },
    ],
  },
  {
    name: "Ping Blog",
    items: [
      {
        path: "/admin/blogs",
        label: "Quản lý blog",
        icon: FileText,
      },
    ],
  },
  {
    name: "Ping Music",
    items: [
      {
        path: "/admin/music",
        label: "Quản lý nhạc",
        icon: Music,
      },
      {
        path: "/admin/albums",
        label: "Quản lý album",
        icon: Disc3,
      },
      {
        path: "/admin/artists",
        label: "Quản lý nghệ sĩ",
        icon: User,
      },
      {
        path: "/admin/genres",
        label: "Quản lý thể loại",
        icon: Tag,
      },
    ],
  },
  {
    name: "Ping Reel",
    items: [
      {
        path: "/admin/reels",
        label: "Quản lý reels",
        icon: Video,
      },
    ],
  },
];
