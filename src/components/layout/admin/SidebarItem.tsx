import React from "react"
import {
  LayoutDashboard,
  Percent,
  Users,
} from "lucide-react"

interface SidebarSubItem {
  title: string;
  path: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  items?: SidebarSubItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Thống kê",
    icon: <LayoutDashboard />,
    path: "/admin",
  },
  {
    title: "Voucher",
    icon: <Percent />,
    path: "/admin/vouchers/list",
  },
  {
    title: "Nhân viên",
    icon: <Users />,
    path: "/admin/staffs/list",  
  },
]