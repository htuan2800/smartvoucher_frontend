import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function VoucherRecipientsPage() {
  const { voucherId } = useParams<{ voucherId: string }>();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!voucherId) return;
    const fetchRecipients = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`${API_BASE_URL}/vouchers/${voucherId}/recipients/`);
        if (!res.ok) {
          toast.error('Không thể tải danh sách nhận voucher');
          return;
        }
        const data = await res.json();
        setVoucher(data.voucher || null);
        setRecipients(data.results || []);
      } catch {
        toast.error('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, [voucherId]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/vouchers/list')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Danh sách khách hàng nhận Voucher
          </h2>
          {voucher && (
            <p className="text-sm text-muted-foreground mt-1">
              {voucher.code} — {voucher.title}
            </p>
          )}
        </div>
      </div>

      {voucher && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mã Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold font-mono">{voucher.code}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng phân bổ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{voucher.recipient_count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{voucher.used_count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{voucher.quantity}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            {recipients.length} khách hàng nhận được voucher này
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-center">Đã sử dụng</TableHead>
                  <TableHead>Ngày nhận</TableHead>
                  <TableHead>Ngày dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((r: any) => (
                  <TableRow key={r.user_id}>
                    <TableCell className="font-mono text-sm">{r.user_id}</TableCell>
                    <TableCell className="font-medium">{r.username}</TableCell>
                    <TableCell className="text-muted-foreground">{r.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.role}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {r.is_used ? (
                        <CheckCircle className="w-5 h-5 text-green-500 inline" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300 inline" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(r.assigned_at)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(r.used_at)}
                    </TableCell>
                  </TableRow>
                ))}
                {recipients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Không có khách hàng nào nhận voucher này
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
