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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmModal } from '@/components/layout/admin/confirmModal';
import { API_BASE_URL, authFetch } from '@/services/apiService';
import { UserPlus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Staff {
  id: number;
  username: string;
  email: string;
  role: string;
  is_staff: boolean;
  is_active: boolean;
}

export default function StaffListPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog: add new staff
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', email: '', password: '' });

  // Dialog: edit role
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Staff | null>(null);
  const [editRole, setEditRole] = useState('');

  // Dialog: confirm delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/users/staff/`);
      if (!res.ok) {
        toast.error('Không thể tải danh sách nhân viên');
        return;
      }
      const data = await res.json();
      setStaffList(data);
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.username || !addForm.email || !addForm.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setAddLoading(true);
    try {
      // Step 1: Register user
      const regRes = await fetch(`${API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({}));
        toast.error(err.message || 'Tạo tài khoản thất bại');
        return;
      }
      // Step 2: Get the customer list to find the new user's ID
      const custRes = await authFetch(`${API_BASE_URL}/users/customers/`);
      if (!custRes.ok) {
        toast.error('Đăng ký nhân viên thành công nhưng không thể cập nhật vai trò');
        setAddDialogOpen(false);
        fetchStaff();
        return;
      }
      const custData: any[] = await custRes.json();
      const newUser = custData.find((u: any) => u.username === addForm.username);
      if (!newUser) {
        toast.success('Đăng ký nhân viên thành công');
        setAddDialogOpen(false);
        fetchStaff();
        return;
      }
      // Step 3: Update role to staff
      const roleRes = await authFetch(`${API_BASE_URL}/users/${newUser.id}/role/`, {
        method: 'PATCH',
        body: JSON.stringify({ role: 'staff' }),
      });
      if (!roleRes.ok) {
        toast.error('Tạo tài khoản thành công nhưng không thể gán vai trò nhân viên');
        return;
      }
      toast.success('Thêm nhân viên thành công');
      setAddForm({ username: '', email: '', password: '' });
      setAddDialogOpen(false);
      fetchStaff();
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editRole) return;
    setEditLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/users/${editTarget.id}/role/`, {
        method: 'PATCH',
        body: JSON.stringify({ role: editRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Cập nhật vai trò thất bại');
        return;
      }
      toast.success('Cập nhật vai trò thành công');
      setEditDialogOpen(false);
      fetchStaff();
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/users/${deleteTarget.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Xóa nhân viên thất bại');
        return;
      }
      toast.success('Xóa nhân viên thành công');
      fetchStaff();
    } catch {
      toast.error('Lỗi kết nối server');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý tài khoản nhân viên và quyền hạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchStaff} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Tạo tài khoản nhân viên mới và gán vai trò staff.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên đăng nhập</label>
                  <Input
                    placeholder="Nhập tên đăng nhập"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Nhập email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mật khẩu</label>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={addLoading}>
                    {addLoading ? 'Đang thêm...' : 'Thêm nhân viên'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
            Tổng cộng {staffList.length} nhân viên
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
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.username}</TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant={s.role === 'admin' ? 'default' : 'secondary'}>
                        {s.role === 'admin' ? 'Admin' : 'Nhân viên'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={s.is_active ? 'default' : 'destructive'}>
                        {s.is_active ? 'Hoạt động' : 'Vô hiệu'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={s.role === 'admin'}
                          onClick={() => {
                            setEditTarget(s);
                            setEditRole(s.role);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa quyền
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={s.role === 'admin'}
                          onClick={() => {
                            setDeleteTarget(s);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {staffList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Không có nhân viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit role dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật vai trò</DialogTitle>
            <DialogDescription>
              Thay đổi vai trò cho nhân viên{' '}
              <span className="font-semibold">{editTarget?.username}</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vai trò mới</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Nhân viên (staff)</SelectItem>
                  <SelectItem value="customer">Khách hàng (customer)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? 'Đang cập nhật...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm modal */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa nhân viên"
        description={`Bạn có chắc muốn vô hiệu hóa tài khoản "${deleteTarget?.username}"? Hành động này có thể hoàn tác bằng cách kích hoạt lại tài khoản.`}
        onConfirm={handleDelete}
        confirmText={deleteLoading ? 'Đang xóa...' : 'Xóa'}
      />
    </div>
  );
}
