import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/layout/admin/confirmModal';
import { authFetch, API_BASE_URL } from '@/services/apiService';
import { Edit, Trash2, Users, Plus, ChevronLeft, ChevronRight, PauseCircle, PlayCircle, Calendar, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
    case 'scheduled': return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'expired': return 'bg-slate-100 text-slate-500 ring-slate-200';
    case 'exhausted': return 'bg-amber-100 text-amber-700 ring-amber-200';
    case 'paused': return 'bg-red-100 text-red-700 ring-red-200';
    default: return 'bg-slate-100 text-slate-500 ring-slate-200';
  }
};

const statusLabel: Record<string, string> = {
  active: 'Đang hoạt động',
  scheduled: 'Chờ phát hành',
  expired: 'Hết hạn',
  exhausted: 'Hết lượt',
  paused: 'Tạm dừng',
};



export default function VoucherListPage() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toggleConfirmOpen, setToggleConfirmOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<any | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        setDebouncedSearch(searchTerm);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/vouchers/stats/performance/?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await authFetch(url);
      if (!res.ok) {
        toast.error('Không thể tải danh sách voucher');
        return;
      }
      const data = await res.json();
      setVouchers(data.results || []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setTotalCount(data.count || (data.results ? data.results.length : 0));
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/vouchers/${deleteTarget.voucher_id}/`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || 'Xóa voucher thất bại');
        return;
      }
      toast.success('Đã xóa voucher thành công');
      fetchVouchers();
    } catch {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleToggleActive = async () => {
    if (!toggleTarget) return;
    setToggleLoading(true);
    try {
      const isCurrentlyActive = toggleTarget.status !== 'paused';
      const res = await authFetch(`${API_BASE_URL}/vouchers/${toggleTarget.voucher_id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isCurrentlyActive })
      });
      if (!res.ok) {
        toast.error((await res.json()).error || 'Lỗi cập nhật trạng thái');
        return;
      }
      toast.success(isCurrentlyActive ? 'Đã tạm dừng voucher' : 'Đã mở lại voucher');
      fetchVouchers();
    } catch {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setToggleLoading(false);
      setToggleConfirmOpen(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [page, pageSize, debouncedSearch]);

  return (
    <div className="p-4 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent pb-1">Quản lý Voucher</h2>
          <p className="text-sm text-slate-500 font-medium">Hệ thống phân phối và theo dõi mã khuyến mãi</p>
        </div>
        <Button
          onClick={() => navigate('/admin/vouchers/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl px-5 h-11 transition-all font-semibold w-fit"
        >
          <Plus className="w-5 h-5 mr-1" />
          Tạo Voucher mới
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 bg-white border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800">Danh sách Voucher</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Quản lý toàn bộ các chương trình ưu đãi và thông tin phát hành</CardDescription>
          </div>
          <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Tìm theo Mã số hoặc Tiêu đề..."
              className="pl-9 h-10 w-full bg-slate-50 border-slate-200/80 transition-all focus:bg-white rounded-xl shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-10 font-medium text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader className="bg-slate-50/70">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="min-w-[140px] font-bold text-slate-700 whitespace-nowrap">Mã Voucher</TableHead>
                    <TableHead className="min-w-[140px] font-bold text-slate-700 whitespace-nowrap">Trị giá Ưu đãi</TableHead>
                    <TableHead className="min-w-[180px] font-bold text-slate-700 whitespace-nowrap">Thời hạn</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 whitespace-nowrap">Đã dùng / Tổng</TableHead>
                    <TableHead className="text-center font-bold text-slate-700 whitespace-nowrap min-w-[200px]">Trạng thái</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-slate-700 whitespace-nowrap min-w-[140px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((v: any) => (
                    <TableRow
                      key={v.voucher_id}
                      className="hover:bg-indigo-50/20 transition-colors border-slate-100/50"
                    >
                      <TableCell className="pl-4">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50/80 border border-indigo-100 font-mono text-[13px] font-bold text-indigo-700 tracking-wider shadow-sm">
                          {v.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`font-bold border px-2 py-0.5 rounded text-[12px] shadow-sm ${v.discount_type === 'percent' ? 'text-violet-700 bg-violet-50/70 border-violet-100/50' : 'text-emerald-700 bg-emerald-50/70 border-emerald-100/50'}`}>
                            {v.discount_type === 'percent' ? `Giảm ${v.discount_value}%` : `Giảm ${formatCurrency(v.discount_value)}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 py-1">
                          <div className="flex items-center text-[12px] font-bold text-slate-700 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
                            <span className="opacity-75 mr-1 font-medium select-none">Bắt đầu:</span> {formatDate(v.release_date)}
                          </div>
                          <div className="flex items-center text-[12px] font-bold text-slate-700 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-500 shrink-0" />
                            <span className="opacity-75 mr-1 font-medium select-none">Kết thúc:</span> {formatDate(v.expiry_date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-700">
                        {v.usage_count} / {v.quantity}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center justify-center h-full">
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-tighter border ring-1 shadow-sm ${getStatusStyles(v.status)}`}
                          >
                            {statusLabel[v.status] || v.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xem chi tiết"
                            className="text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 font-medium rounded-xl transition-all shadow-sm shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/vouchers/${v.voucher_id}/detail`);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={v.status === 'paused' ? "Mở lại" : "Tạm dừng"}
                            className={`shrink-0 font-medium rounded-xl transition-all shadow-sm ${v.status === 'paused' ? 'text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100' : 'text-amber-500 bg-amber-50/50 hover:bg-amber-100'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setToggleTarget(v);
                              setToggleConfirmOpen(true);
                            }}
                          >
                            {v.status === 'paused' ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Sửa Voucher"
                            className="text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 font-medium rounded-xl transition-all shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/vouchers/${v.voucher_id}/edit`);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Người nhận Voucher"
                            className="text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 hover:text-emerald-700 font-medium rounded-xl transition-all shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/vouchers/${v.voucher_id}/recipients`);
                            }}
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xóa Voucher"
                            className="text-red-500 bg-red-50/50 hover:bg-red-100 hover:text-red-600 font-medium rounded-xl transition-all shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(v);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {vouchers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground font-medium">
                        <div className="flex flex-col items-center justify-center opacity-60">
                          <span className="text-4xl mb-3">📭</span>
                          Không tìm thấy chương trình Voucher nào
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-4 bg-white/60 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500">
              Hiển thị <span className="font-bold text-indigo-600">{vouchers.length}</span> / <span className="font-bold text-slate-800">{totalCount}</span> voucher
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 whitespace-nowrap hidden sm:inline-block">Dòng hiển thị:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] bg-white border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shadow-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!hasPrev && page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="flex items-center justify-center min-w-[32px] h-8 rounded-md bg-slate-50 text-sm font-bold text-slate-600 border border-slate-200">
                  {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shadow-sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasNext && vouchers.length < 10}
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xác nhận xóa Voucher"
        description={`Bạn có chắc chắn muốn xóa voucher ${deleteTarget?.code}? Hành động này sẽ ẩn voucher khỏi hệ thống người dùng.`}
        confirmText="Đồng ý xóa"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
      />

      <ConfirmModal
        open={toggleConfirmOpen}
        onOpenChange={setToggleConfirmOpen}
        title={toggleTarget?.status === 'paused' ? "Xác nhận mở lại" : "Xác nhận tạm dừng"}
        description={toggleTarget?.status === 'paused' 
          ? `Bạn có muốn mở lại voucher ${toggleTarget?.code}? Voucher sẽ có thể được áp dụng trở lại.`
          : `Bạn có muốn tạm dừng voucher ${toggleTarget?.code}? Người dùng sẽ không thể áp dụng voucher này cho đến khi được mở lại.`
        }
        confirmText={toggleTarget?.status === 'paused' ? "Mở lại ngay" : "Tạm dừng ngay"}
        variant={toggleTarget?.status === 'paused' ? "info" : "warning"}
        isLoading={toggleLoading}
        onConfirm={handleToggleActive}
      />

    </div>
  );
}
