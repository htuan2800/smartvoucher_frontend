import { 
  DollarSign, 
  Users, 
  Ticket, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- DỮ LIỆU GIẢ LẬP (Sẽ thay bằng gọi API sau) ---
const revenueData = [
  { month: 'Thg 10', revenue: 120000000 },
  { month: 'Thg 11', revenue: 180000000 },
  { month: 'Thg 12', revenue: 250000000 },
  { month: 'Thg 1', revenue: 210000000 },
  { month: 'Thg 2', revenue: 290000000 },
  { month: 'Thg 3', revenue: 350000000 },
];

const topToursData = [
  { name: 'Đà Lạt 3N2Đ', bookings: 124 },
  { name: 'Sapa Mùa Lúa', bookings: 98 },
  { name: 'Phú Quốc 4N3Đ', bookings: 85 },
  { name: 'Nha Trang', bookings: 62 },
  { name: 'Hà Giang Loop', bookings: 45 },
];

const paymentMethodData = [
  { name: 'Chuyển khoản (VNPAY)', value: 55 },
  { name: 'Tiền mặt', value: 30 },
  { name: 'Ví MoMo', value: 15 },
];

const COLORS = ['#00529C', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Hàm format tiền tệ VNĐ dùng cho Tooltip
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan Kinh doanh</h1>
        <p className="text-sm text-slate-500">Cập nhật lần cuối: Hôm nay</p>
      </div>

      {/* ================= THẺ CHỈ SỐ TỔNG QUAN (TOP CARDS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Tổng Doanh Thu (Tháng này)</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><DollarSign className="w-5 h-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">350.000.000 ₫</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +20.1% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Đơn Hàng Mới</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Ticket className="w-5 h-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">+145</div>
            <p className="text-xs text-slate-500 mt-1">Gồm 120 đơn đã thanh toán</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Khách Hàng</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Users className="w-5 h-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">420</div>
            <p className="text-xs text-slate-500 mt-1">350 Người lớn, 70 Trẻ em</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Chờ Thu Tiền (Pending)</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg text-red-600"><CreditCard className="w-5 h-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">45.000.000 ₫</div>
            <p className="text-xs text-red-500 mt-1">Cần giục Sale chốt khách</p>
          </CardContent>
        </Card>
      </div>

      {/* ================= BIỂU ĐỒ CHÍNH (CHARTS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ Doanh thu (Area Chart) - Chiếm 2/3 không gian */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Biến động Doanh Thu (6 tháng qua)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-87.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00529C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00529C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis 
                    tickFormatter={(value) => `${value / 1000000}Tr`} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b'}} 
                    dx={-10}
                  />
                  <Tooltip 
  formatter={(value: any) => [
    formatCurrency(Number(value) || 0), // Ép kiểu an toàn, lỡ undefined thì ra 0
    "Doanh thu"
  ]}
  contentStyle={{ 
    borderRadius: '8px', 
    border: 'none', 
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
  }}
/>
                  <Area type="monotone" dataKey="revenue" stroke="#00529C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ Top Tour (Bar Chart) - Chiếm 1/3 không gian */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Top 5 Tour Bán Chạy Nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-87.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topToursData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={90} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="bookings" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} name="Số Booking" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ================= HÀNG DƯỚI CÙNG (PIE CHART & DANH SÁCH) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ tròn Phương thức thanh toán */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Tỷ lệ Cổng thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend tự chế cho đẹp */}
            <div className="flex gap-4 mt-4 text-sm text-slate-600">
              {paymentMethodData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bảng giao dịch gần đây */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Booking Mới Nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã Đơn</th>
                    <th className="px-4 py-3 font-medium">Khách Hàng</th>
                    <th className="px-4 py-3 font-medium">Tour</th>
                    <th className="px-4 py-3 font-medium">Tổng Tiền</th>
                    <th className="px-4 py-3 font-medium text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#00529C]">TOUR_17A9B</td>
                    <td className="px-4 py-3">Nguyễn Văn A</td>
                    <td className="px-4 py-3 line-clamp-1">Đà Lạt 3N2Đ Khởi hành...</td>
                    <td className="px-4 py-3 font-medium">5.500.000 ₫</td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Thành công</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#00529C]">TOUR_99C2X</td>
                    <td className="px-4 py-3">Trần Thị B</td>
                    <td className="px-4 py-3 line-clamp-1">Phú Quốc 4N3Đ Tàu cao...</td>
                    <td className="px-4 py-3 font-medium">12.000.000 ₫</td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">Chờ thanh toán</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}