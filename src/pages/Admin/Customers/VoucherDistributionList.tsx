import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
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
import { API_BASE_URL, authFetch } from '@/services/apiService';
import { Gift, ArrowRight, Activity, Calendar, Percent } from 'lucide-react';
import { toast } from 'sonner';

const statusVariant: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  scheduled: 'bg-blue-100 text-blue-700 ring-blue-200',
  expired: 'bg-slate-100 text-slate-700 ring-slate-200',
  exhausted: 'bg-amber-100 text-amber-700 ring-amber-200',
};

const statusLabel: Record<string, string> = {
  active: 'Hoạt động',
  scheduled: 'Lên lịch',
  expired: 'Hết hạn',
  exhausted: 'Hết lượt',
};

export default function VoucherDistributionList() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/vouchers/`);
      if (!res.ok) {
        toast.error('Không thể tải danh sách voucher');
        return;
      }
      const data = await res.json();
      setVouchers(data.results || []);
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent italic">
            Phân bổ Voucher
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider opacity-70">
            Quản lý và theo dõi danh sách khách hàng nhận ưu đãi
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end px-4 border-r border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Tổng Voucher</span>
                <span className="text-xl font-black text-slate-700">{vouchers.length}</span>
            </div>
            <Gift className="w-10 h-10 text-indigo-500 opacity-20" />
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-white/50 border-b border-slate-50 px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Chọn Voucher để xem chi tiết người nhận
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Đang nạp dữ liệu...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] font-bold text-slate-700 pl-8 uppercase text-[10px] tracking-widest">Mã</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Tiêu đề Voucher</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Trạng thái</TableHead>
                    <TableHead className="text-center font-bold text-slate-700 uppercase text-[10px] tracking-widest">Người nhận</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 pr-8 uppercase text-[10px] tracking-widest">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((v) => (
                    <TableRow 
                      key={v.voucher_id} 
                      className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-slate-100"
                      onClick={() => navigate(`/admin/customers/${v.voucher_id}/recipients`)}
                    >
                      <TableCell className="pl-8">
                        <Badge className="bg-slate-900 text-white rounded-lg px-2 py-0.5 font-mono text-xs ring-0 border-none">
                          {v.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tighter">
                                {v.title.replace(/ - ID tự động \d+$/, '')}
                            </span>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Hạn: {new Date(v.expiry_date).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Percent className="w-3 h-3" />
                                    Dùng: {v.used_count}/{v.quantity}
                                </span>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-tighter ring-1 border-none",
                            statusVariant[v.status] || 'bg-slate-100 text-slate-400'
                          )}
                        >
                          {statusLabel[v.status] || v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {Math.round(v.usage_rate_percent * v.quantity / 100) || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2 text-indigo-500 font-bold text-xs group-hover:translate-x-1 transition-transform">
                            <span>Chi tiết người nhận</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Bổ sung cn helper vì đây là file mới hoàn toàn
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
