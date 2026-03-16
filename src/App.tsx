import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/Admin/Dashboard/DashboardPage'
import LoginPage from './pages/Admin/LoginPage'
import HomePage from './pages/Public/HomePage'
import { authApi } from './services/apiService'

function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Trang này đang được phát triển.</p>
    </div>
  )
}

function RequireAdminAuth() {
  return authApi.getAccessToken() ? <Outlet /> : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route element={<RequireAdminAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="staffs/list" element={<AdminPlaceholderPage title="Danh sách nhân viên" />} />
            <Route path="customers/list" element={<AdminPlaceholderPage title="Danh sách khách hàng" />} />
            <Route path="settings" element={<AdminPlaceholderPage title="Cài đặt hệ thống" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
