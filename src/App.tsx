import { Route, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/Admin/Dashboard/DashboardPage'
function App() {
   return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage/>} />
        </Route>
      </Routes>
    </>
    )
}

export default App
