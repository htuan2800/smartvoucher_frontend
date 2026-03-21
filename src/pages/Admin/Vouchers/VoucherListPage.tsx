import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { API_BASE_URL, authFetch } from '@/services/apiService';
import { DatePickerWithRange } from '../Dashboard/DateRangePicker';
import { Users } from 'lucide-react';
import { toast } from 'sonner';

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

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  scheduled: 'secondary',
  expired: 'destructive',
  exhausted: 'outline',
};

const statusLabel: Record<string, string> = {
  active: 'Đang hoạt động',
  scheduled: 'Chờ phát hành',
  expired: 'Hết hạn',
  exhausted: 'Hết lượt',
};

export default function VoucherListPage() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState({ from: '2026-03-01', to: '2026-03-31' });

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/vouchers/stats/performance/?start_date=${date.from}&end_date=${date.to}`;
      const res = await authFetch(url);
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
  }, [date]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Danh sách Voucher</CardTitle>
            <CardDescription>Nhấn vào một voucher để xem danh sách khách hàng nhận được</CardDescription>
          </div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã / Tên Voucher</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead className="text-right">Đã phân bổ</TableHead>
                  <TableHead className="text-right">Đã dùng / Tổng</TableHead>
                  <TableHead className="text-right">Tỉ lệ</TableHead>
                  <TableHead className="text-right">Tổng giảm giá</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((v: any) => (
                  <TableRow
                    key={v.voucher_id}
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => navigate(`/admin/vouchers/${v.voucher_id}/recipients`)}
                  >
                    <TableCell>
                      <div className="font-medium">{v.code}</div>
                      <div className="text-xs text-muted-foreground">{v.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[v.status] || 'outline'}>
                        {statusLabel[v.status] || v.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(v.release_date)}</div>
                      <div className="text-xs text-muted-foreground">đến {formatDate(v.expiry_date)}</div>
                    </TableCell>
                    <TableCell className="text-right">{v.assigned_count}</TableCell>
                    <TableCell className="text-right">
                      {v.usage_count} / {v.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          v.usage_rate_percent > 0 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.usage_rate_percent}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-red-500 font-medium">
                      {v.total_discount_amount > 0 ? `-${formatCurrency(v.total_discount_amount)}` : '0 ₫'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/vouchers/${v.voucher_id}/recipients`);
                        }}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Xem danh sách
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {vouchers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
