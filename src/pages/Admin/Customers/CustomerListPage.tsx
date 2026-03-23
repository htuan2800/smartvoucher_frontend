import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { API_BASE_URL, authFetch } from '@/services/apiService';
import { Calendar, Clock, Edit, Eye, Lock, Mail, Plus, RefreshCw, Search, ShieldCheck, Star, Trash2, Unlock, UserCircle, UserPlus, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Customer {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  points: number;
  total_spent: number;
  date_joined: string;
  last_login: string | null;
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    points: 0,
    total_spent: 0
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/users/customers/?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await authFetch(url);
      const data = await res.json();

      if (res.ok) {
        setCustomers(data.results);
        setTotalPages(data.total_pages);
        setTotalCount(data.count);
      } else {
        toast.error('Không thể tải danh sách khách hàng');
      }
    } catch {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, debouncedSearch]);

  const handleToggleActive = async (customerId: number, currentActive: boolean) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/users/${customerId}/toggle-active/`, {
        method: 'PATCH',
      });
      if (res.ok) {
        toast.success(currentActive ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt tài khoản');
        fetchCustomers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Lỗi cập nhật trạng thái');
      }
    } catch {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (customerId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này? (Hành động này sẽ vô hiệu hóa tài khoản)')) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/users/${customerId}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Đã xóa khách hàng thành công');
        fetchCustomers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Lỗi khi xóa');
      }
    } catch {
      toast.error('Lỗi server');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let url = `${API_BASE_URL}/users/register/`;
      let method = 'POST';
      let payload: any = { ...formData };

      if (formMode === 'edit' && selectedUser) {
        url = `${API_BASE_URL}/users/${selectedUser.id}/update/`;
        method = 'PATCH';
        delete payload.password; // Không sửa password qua đây
      }

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(formMode === 'create' ? 'Tạo khách hàng mới thành công' : 'Cập nhật thành công');
        setFormOpen(false);
        fetchCustomers();
      } else {
        const err = await res.json();
        toast.error(err.message || err.error || 'Lỗi xử lý yêu cầu');
      }
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (c: Customer) => {
    setFormMode('edit');
    setSelectedUser(c);
    setFormData({
      username: c.username,
      email: c.email,
      password: '',
      points: c.points,
      total_spent: c.total_spent
    });
    setFormOpen(true);
  };

  const openCreate = () => {
    setFormMode('create');
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      points: 0,
      total_spent: 0
    });
    setFormOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header Section - Exactly MATCHING Voucher Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent pb-1">
            Quản lý Khách hàng
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Hệ thống quản trị và chăm sóc cơ sở dữ liệu thành viên
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl px-5 h-11 transition-all font-semibold w-fit"
        >
          <Plus className="w-5 h-5 mr-1" />
          Thêm Khách hàng mới
        </Button>
      </div>

      {/* Main Table Container - MATCHING Voucher Style */}
      <div className="border-none shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">Danh sách Khách hàng</h3>
            <p className="text-sm text-slate-500 font-medium">Quản lý toàn bộ thông tin tài khoản và điểm tích lũy</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                placeholder="Tìm theo Tên hoặc Email..."
                className="pl-9 h-10 w-full bg-slate-50 border-slate-200/80 transition-all focus:bg-white rounded-xl shadow-sm text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchCustomers} 
              className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 text-indigo-600 shrink-0 shadow-sm transition-all"
            >
               <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-slate-50 h-20">
                <TableHead className="font-black text-slate-600 pl-6 uppercase text-[12px] tracking-widest">Khách hàng</TableHead>
                <TableHead className="font-black text-slate-600 uppercase text-[12px] tracking-widest">Email liên hệ</TableHead>
                <TableHead className="font-black text-slate-600 uppercase text-[12px] tracking-widest text-right">Tích lũy</TableHead>
                <TableHead className="font-black text-slate-600 uppercase text-[12px] tracking-widest text-right">Tổng chi tiêu</TableHead>
                <TableHead className="font-black text-slate-600 uppercase text-[12px] tracking-widest text-center">Trạng thái</TableHead>
                <TableHead className="font-black text-slate-600 uppercase text-[12px] tracking-widest text-right pr-6">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse h-20 border-slate-50">
                    <TableCell colSpan={6} className="bg-slate-50/10 h-20"></TableCell>
                  </TableRow>
                ))
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <TableRow key={c.id} className="group hover:bg-slate-50/50 transition-all h-20 border-slate-50/50">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 flex items-center justify-center border border-indigo-100/50 shadow-sm">
                          <UserCircle className="w-7 h-7 text-[#5a46e5]" />
                        </div>
                        <span className="font-black text-slate-800 text-sm whitespace-nowrap">{c.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/60 font-mono text-[13px] font-bold text-[#5a46e5] tracking-wider shadow-sm">
                        {c.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-black text-[13px] border border-amber-200/50 shadow-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        {c.points.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="font-black text-slate-800 text-base">
                          {new Intl.NumberFormat('vi-VN').format(c.total_spent)}<span className="text-xs ml-1 text-slate-400 font-bold uppercase tracking-tighter">đ</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "whitespace-nowrap rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-tighter border shadow-sm ring-1",
                          c.is_active 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10 shadow-emerald-100" 
                            : "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10 shadow-rose-100"
                        )}
                        variant="outline"
                      >
                        {c.is_active ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost" size="icon" title="Xem chi tiết"
                          className="w-9 h-9 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 shadow-sm"
                          onClick={(e) => { e.stopPropagation(); setDetailCustomer(c); setDetailOpen(true); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" title="Sửa thông tin"
                          className="w-9 h-9 rounded-xl text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 transition-all shadow-sm"
                          onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" title={c.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          className={cn(
                            "w-9 h-9 rounded-xl transition-all shadow-sm",
                            c.is_active 
                              ? "text-amber-600 bg-amber-50/50 hover:bg-amber-100 hover:text-amber-700" 
                              : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 hover:text-emerald-700"
                          )}
                          onClick={(e) => { e.stopPropagation(); handleToggleActive(c.id, c.is_active); }}
                        >
                          {c.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon" title="Xóa tài khoản"
                          className="w-9 h-9 rounded-xl text-rose-500 bg-rose-50/50 hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm"
                          onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32">
                    <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Không có dữ liệu phù hợp</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Statistics & Pagination - Mirroring UI */}
        <div className="px-6 py-4 bg-white/60 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium text-slate-500">
            Hiển thị <span className="font-bold text-[#5a46e5]">{customers.length}</span> / <span className="font-bold text-slate-800">{totalCount}</span> khách hàng
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 whitespace-nowrap hidden sm:inline-block">Dòng hiển thị:</span>
              <select
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/10 shadow-sm"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="h-8 px-3 rounded-lg border-slate-200 font-bold text-slate-500 hover:bg-slate-50 text-xs shadow-sm"
              >
                Trước
              </Button>
              <div className="h-8 min-w-[32px] px-2 flex items-center justify-center bg-slate-50 text-slate-600 border border-slate-200 rounded-lg font-bold text-xs" title="Trang hiện tại">
                {page}
              </div>
              <Button
                variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="h-8 px-3 rounded-lg border-slate-200 font-bold text-slate-500 hover:bg-slate-50 text-xs shadow-sm"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Dialog: Create & Edit */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-8 border-none shadow-2xl outline-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              {formMode === 'create' ? <UserPlus className="w-7 h-7 text-[#5a46e5]" /> : <Edit className="w-7 h-7 text-[#5a46e5]" />}
              {formMode === 'create' ? 'Tạo Khách hàng mới' : 'Cập nhật thông tin'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Họ và Tên</Label>
              <Input
                required placeholder="Nhập tên đăng nhập..."
                className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 ring-indigo-500/10 font-bold text-lg"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Địa chỉ Email</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <Input
                  required type="email" placeholder="example@email.com"
                  className="h-14 bg-slate-50 border-none rounded-2xl pl-14 pr-6 focus:ring-2 ring-indigo-500/10 font-bold text-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {formMode === 'create' && (
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Mật khẩu ban đầu</Label>
                <Input
                  required type="password" placeholder="••••••••"
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 ring-indigo-500/10 font-bold text-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

            {formMode === 'edit' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Điểm tích lũy</Label>
                  <Input
                    type="number" className="h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-lg"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Tổng chi tiêu</Label>
                  <Input
                    type="number" className="h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-lg"
                    value={formData.total_spent}
                    onChange={(e) => setFormData({ ...formData, total_spent: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-50" onClick={() => setFormOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={formLoading} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100">
                {formLoading ? <RefreshCw className="animate-spin" /> : (formMode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog - Already Styled Previously */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden outline-none">
          <div className="bg-gradient-to-br from-[#5a46e5] to-indigo-800 h-40 relative">
            <div className="absolute -bottom-16 left-12 p-1.5 bg-white rounded-[2rem] shadow-2xl">
              <div className="bg-[#f5f3ff] w-32 h-32 rounded-[1.75rem] flex items-center justify-center border border-indigo-100">
                <UserCircle className="w-20 h-20 text-[#5a46e5]" />
              </div>
            </div>
            <div className="absolute top-8 right-12">
                  <Badge className={cn(
                    "px-6 py-2 rounded-2xl font-black border-none text-[11px] uppercase tracking-[0.2em] text-white shadow-xl backdrop-blur-md",
                    detailCustomer?.is_active ? "bg-emerald-500/90" : "bg-rose-500/90"
                  )}>
                    {detailCustomer?.is_active ? 'Thành viên Active' : 'Tài khoản Đã Khóa'}
                  </Badge>
            </div>
          </div>

          <div className="pt-20 pb-12 px-12 space-y-10">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{detailCustomer?.username}</h3>
                <p className="text-lg text-slate-500 font-bold flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  {detailCustomer?.email}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex-1 min-w-[160px] shadow-sm">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2 text-center">Tích lũy</span>
                  <div className="flex items-center justify-center gap-2 text-3xl font-black text-slate-800">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                    {detailCustomer?.points.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex-1 min-w-[160px] shadow-sm">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2 text-center">Chi tiêu</span>
                  <div className="flex items-center justify-center gap-2 text-3xl font-black text-emerald-600">
                    <Wallet className="w-6 h-6" />
                    {detailCustomer ? new Intl.NumberFormat('vi-VN').format(detailCustomer.total_spent) : 0}đ
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày gia nhập</span>
                    <span className="text-lg font-bold text-slate-700">{formatDate(detailCustomer?.date_joined || null)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Lần đăng nhập cuối</span>
                    <span className="text-lg font-bold text-slate-700">{detailCustomer?.last_login ? new Date(detailCustomer.last_login).toLocaleString('vi-VN') : 'Chưa có'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100 relative overflow-hidden group">
                <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-100/60 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <div className="bg-white/80 backdrop-blur-sm w-fit px-4 py-1.5 rounded-xl border border-indigo-100 mb-4">
                    <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Tiêu chuẩn Hệ thống</span>
                  </div>
                  <h4 className="text-2xl font-black text-indigo-900 mb-2 italic">DIAMOND MEMBER</h4>
                  <p className="text-indigo-700/60 text-sm font-bold leading-relaxed px-1">Quyền lợi thành viên cao cấp được bảo vệ bởi hệ thống.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-slate-600 border-slate-200 hover:bg-slate-50 transition-all" onClick={() => setDetailOpen(false)}>Thoát Chế độ xem</Button>
              <Button className="h-14 px-10 bg-[#5a46e5] hover:bg-[#4838b7] text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95">Chỉnh sửa Hồ sơ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
