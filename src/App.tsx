import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/Admin/Dashboard/DashboardPage'
import LoginPage from './pages/Admin/LoginPage'
import VoucherListPage from './pages/Admin/Vouchers/VoucherListPage'
import VoucherRecipientsPage from './pages/Admin/Vouchers/VoucherRecipientsPage'
import StaffListPage from './pages/Admin/Staffs/StaffListPage'
import { authApi } from './services/apiService'

function RequireAdminAuth() {
  return authApi.getAccessToken() ? <Outlet /> : <Navigate to="/admin/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<RequireAdminAuth />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="vouchers/list" element={<VoucherListPage />} />
          <Route path="vouchers/:voucherId/recipients" element={<VoucherRecipientsPage />} />
          <Route path="staffs/list" element={<StaffListPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </>
  )
}

export default App
