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
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { voucherApi } from '@/services/apiService';
import {
  Mail,
  MailCheck,
  MailX,
  MailWarning,
  RefreshCw,
  Send,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryLog {
  id: number;
  user_id: number;
  username: string;
  email: string;
  channel: string;
  status: string;
  status_display: string;
  error_message: string;
  sent_at: string;
}

interface Summary {
  total: number;
  sent: number;
  failed: number;
  skipped: number;
}

const statusConfig: Record<string, { icon: typeof MailCheck; color: string; label: string }> = {
  sent: { icon: MailCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Đã gửi' },
  failed: { icon: MailX, color: 'bg-red-50 text-red-700 border-red-200', label: 'Thất bại' },
  skipped_no_email: { icon: MailWarning, color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Không có email' },
};

export default function VoucherDeliveryLogPage() {
  const { voucherId } = useParams<{ voucherId: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, sent: 0, failed: 0, skipped: 0 });
  const [loading, setLoading] = useState(false);
  const [resendingId, setResendingId] = useState<number | null>(null);

  // Send email dialog
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  const fetchLogs = async () => {
    if (!voucherId) return;
    setLoading(true);
    try {
      const data = await voucherApi.deliveryLogs(Number(voucherId));
      setLogs(data.results || []);
      setSummary(data.summary || { total: 0, sent: 0, failed: 0, skipped: 0 });
    } catch {
      toast.error('Không thể tải lịch sử gửi email');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [voucherId]);

  const handleResend = async (log: DeliveryLog) => {
    setResendingId(log.id);
    try {
      const result = await voucherApi.resendEmail(Number(voucherId), log.user_id);
      toast.success(result.message || 'Gửi lại email thành công');
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Gửi lại email thất bại');
    } finally {
      setResendingId(null);
    }
  };

  const handleSendToEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendEmail.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    setSendLoading(true);
    try {
      const result = await voucherApi.sendEmail(Number(voucherId), sendEmail.trim());
      toast.success(result.message || 'Gửi email thành công');
      setSendEmail('');
      setSendDialogOpen(false);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Gửi email thất bại');
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Mail className="w-7 h-7 text-indigo-600" />
              Lịch sử gửi Email
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Voucher #{voucherId} — Theo dõi trạng thái gửi email thông báo
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4 mr-1" />
                Gửi đến Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gửi Voucher qua Email</DialogTitle>
                <DialogDescription>
                  Nhập email khách hàng để phân phối voucher và gửi thông báo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendToEmail} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email khách hàng</label>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    value={sendEmail}
                    onChange={(e) => setSendEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Khách hàng sẽ được tự động phân phối voucher và nhận email thông báo.
                  </p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setSendDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={sendLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {sendLoading ? 'Đang gửi...' : 'Gửi Email'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng</p>
                <p className="text-2xl font-black">{summary.total}</p>
              </div>
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Thành công</p>
                <p className="text-2xl font-black text-emerald-700">{summary.sent}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">Thất bại</p>
                <p className="text-2xl font-black text-red-700">{summary.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Bỏ qua</p>
                <p className="text-2xl font-black text-amber-700">{summary.skipped}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết gửi Email</CardTitle>
          <CardDescription>
            Danh sách tất cả email đã gửi cho voucher này
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Chưa có email nào được gửi cho voucher này</p>
              <p className="text-xs text-slate-400 mt-1">
                Nhấn "Gửi đến Email" để gửi voucher cho khách hàng
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Lỗi</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const config = statusConfig[log.status] || statusConfig.failed;
                  const StatusIcon = config.icon;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{log.email || '—'}</TableCell>
                      <TableCell>
                        <Badge className={`${config.color} border gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-red-500 max-w-[200px] truncate">
                        {log.error_message || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.sent_at).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        {(log.status === 'failed' || log.status === 'skipped_no_email') && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={resendingId === log.id}
                            onClick={() => handleResend(log)}
                          >
                            <RefreshCw className={`w-3 h-3 mr-1 ${resendingId === log.id ? 'animate-spin' : ''}`} />
                            Gửi lại
                          </Button>
                        )}
                        {log.status === 'sent' && (
                          <span className="text-xs text-emerald-500 font-medium">✓ Đã gửi</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
