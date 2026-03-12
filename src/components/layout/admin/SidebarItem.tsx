import {
  Home,
  LayoutDashboard,
  ListOrdered,
  LocateIcon,
  Percent,
  Torus,
  UserRound,
  Users,
  
} from "lucide-react"
export const sidebarItems = [
  {
    title: "Thống kê",
    icon: <LayoutDashboard />,
    path: "/admin",
  },
  {
    title: "Nhân viên",
    icon: <Users />,
    path: "/admin/staffs/list",  
  },
  {
    title: "Khách hàng",
    icon: <UserRound />,
    path: "/admin/customers/list",
  }
]