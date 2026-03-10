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
    requiredPermission: 'staff.view'
  },
  {
    title: "Khách hàng",
    icon: <UserRound />,
    path: "/admin/customers/list",
    requiredPermission: 'customer.view'
  },
  {
    title: "Địa điểm",
    icon: <LocateIcon />,
    path: "/admin/locations/list",
    requiredPermission: 'location.view'
  },
  {
    title: "Tour",
    icon: <Torus />,
    path: "/admin/tours/list",
    requiredPermission: 'tour.view'
  },
  {
    title: "Mã giảm giá",
    icon: <Percent />,
    path: "/admin/coupons/list",
    requiredPermission: 'coupon.view'
  },
  {
    title: "Bookings",
    icon: <ListOrdered />,
    path: "/admin/bookings/list",
    requiredPermission: 'booking.view'
  },
  {
    title: "Phân quyền",
    icon: <Users />,
    path: "/admin/roles/list",
    requiredPermission: 'role.view'
  }
]