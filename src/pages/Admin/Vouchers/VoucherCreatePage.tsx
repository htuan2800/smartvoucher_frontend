import { useState } from "react"
import { 
  ArrowLeft, 
  Save, 
  Info, 
  Settings2, 
  Ticket,
  Percent,
  CircleDollarSign,
  PackageSearch,
  Calendar,
  Users
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Switch,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui"
import { voucherApi } from "@/services/apiService"
import { cn } from "@/lib/utils"

export default function VoucherCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    discount_type: "percent",
    discount_value: 0,
    release_date: new Date().toISOString().slice(0, 16),
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    quantity: 100,
    event_type: "welcome",
    rule: {
      required_role: "customer",
      birthday_only: false,
      min_order_amount: 0,
      min_items: 0,
      required_product_type: "",
      period_type: ""
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith("rule.")) {
      const ruleField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        rule: {
          ...prev.rule,
          [ruleField]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.startsWith("rule.")) {
      const ruleField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        rule: { ...prev.rule, [ruleField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.startsWith("rule.")) {
      const ruleField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        rule: { ...prev.rule, [ruleField]: checked }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề voucher")
      return
    }

    try {
      setLoading(true)
      const payload = {
        ...formData,
        release_date: new Date(formData.release_date).toISOString(),
        expiry_date: new Date(formData.expiry_date).toISOString(),
        rule: {
            ...formData.rule,
            period_type: formData.rule.period_type || null
        }
      }
      
      await voucherApi.create(payload)
      toast.success("Tạo voucher thành công!")
      navigate("/admin/vouchers")
    } catch (error: any) {
      console.error("Lỗi khi tạo voucher:", error)
      toast.error(error.response?.data?.error || "Đã có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header - Simple & Clean */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/vouchers")}
            className="rounded-full h-10 w-10 border-white/10 bg-background/50 hover:bg-background/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tạo Voucher mới</h1>
            <p className="text-sm text-muted-foreground italic">Thiết lập các thông số cho chiến dịch khuyến mãi.</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Đang lưu..." : "Lưu Voucher"}
        </Button>
      </div>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 p-1 border-white/5 rounded-xl h-11 mb-2">
            <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6 font-medium gap-2">
              <Info className="h-4 w-4" /> Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="rule" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6 font-medium gap-2">
              <Settings2 className="h-4 w-4" /> Điều kiện áp dụng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4 space-y-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" /> Chi tiết voucher
                </CardTitle>
                <CardDescription>Thông tin chính sẽ hiển thị cho khách hàng.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tên chiến dịch / Tiêu đề</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="VD: Giảm giá mùa hè" 
                      className="bg-background/50 border-white/5"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã Voucher (Code)</Label>
                    <Input 
                      id="code" 
                      name="code" 
                      placeholder="VD: SUMMER24 (Để trống để tự tạo)" 
                      className="bg-background/50 border-white/5 uppercase font-mono"
                      value={formData.code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Loại giảm giá</Label>
                    <Select value={formData.discount_type} onValueChange={(v) => handleSelectChange("discount_type", v)}>
                      <SelectTrigger className="bg-background/50 border-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="percent">Phần trăm (%)</SelectItem>
                        <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Giá trị giảm</Label>
                    <Input 
                      name="discount_value" 
                      type="number" 
                      className="bg-background/50 border-white/5"
                      value={formData.discount_value}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số lượng phát hành</Label>
                    <Input 
                      name="quantity" 
                      type="number" 
                      className="bg-background/50 border-white/5"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> Ngày bắt đầu
                    </Label>
                    <Input 
                      name="release_date" 
                      type="datetime-local" 
                      className="bg-background/50 border-white/5 flex"
                      value={formData.release_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> Ngày kết thúc
                    </Label>
                    <Input 
                      name="expiry_date" 
                      type="datetime-local" 
                      className="bg-background/50 border-white/5 flex"
                      value={formData.expiry_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rule" className="mt-4 space-y-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" /> Ràng buộc điều kiện
                </CardTitle>
                <CardDescription>Xác định ai và khi nào có thể áp dụng mã này.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" /> Vai trò yêu cầu
                      </Label>
                      <Select 
                        value={formData.rule.required_role} 
                        onValueChange={(v) => handleSelectChange("rule.required_role", v)}
                      >
                        <SelectTrigger className="bg-background/50 border-white/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                          <SelectItem value="customer">Khách hàng thông thường</SelectItem>
                          <SelectItem value="staff">Nhân viên</SelectItem>
                          <SelectItem value="admin">Quản trị viên</SelectItem>
                          <SelectItem value="none">Công khai / Tất cả</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Chỉ dành cho sinh nhật</Label>
                        <p className="text-[10px] text-muted-foreground">Chỉ áp dụng trong tháng sinh nhật của khách.</p>
                      </div>
                      <Switch 
                        checked={formData.rule.birthday_only}
                        onCheckedChange={(c: boolean) => handleSwitchChange("rule.birthday_only", c)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" /> Đơn hàng tối thiểu (đ)
                      </Label>
                      <Input 
                        name="rule.min_order_amount" 
                        type="number" 
                        className="bg-background/50 border-white/5"
                        value={formData.rule.min_order_amount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <PackageSearch className="h-4 w-4 text-muted-foreground" /> Loại sản phẩm yêu cầu
                      </Label>
                      <Input 
                        name="rule.required_product_type" 
                        placeholder="VD: drink, food..." 
                        className="bg-background/50 border-white/5"
                        value={formData.rule.required_product_type}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-12 rounded-xl text-lg font-bold"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất & Xuất bản"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
