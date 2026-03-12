import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
  Bar
} from "recharts";
import { Ticket, Percent, TrendingUp, DollarSign, Activity } from "lucide-react";

// --- MOCK DATA TỪ API ---
const overviewData = {
  total_vouchers: 2,
  total_assigned: 2,
  total_used: 1,
  usage_rate_percent: 50.0,
  total_discount_amount: 10000.0,
  gross_revenue: 85000.0,
  net_revenue: 75000.0
};

const chartData = [
  {
    period: "2026-03-09T00:00:00Z",
    usage_count: 0,
    discount_amount: 0.0
  },
  {
    period: "2026-03-12T00:00:00Z",
    usage_count: 1,
    discount_amount: 10000.0
  },
  {
    period: "2026-03-15T00:00:00Z",
    usage_count: 3,
    discount_amount: 25000.0 // Thêm chút data giả để biểu đồ sinh động hơn
  }
];

const performanceData = [
  {
    voucher_id: 2,
    code: "VC-IXNUXMCCFM",
    title: "Scheduled Welcome Voucher",
    status: "active",
    release_date: "2026-02-28T09:00:00Z",
    expiry_date: "2026-03-31T23:59:59Z",
    quantity: 500,
    remaining_quantity: 500,
    usage_count: 0,
    usage_rate_percent: 0.0,
    total_discount_amount: 0,
    revenue_impacted: 0
  },
  {
    voucher_id: 1,
    code: "VC-M4GRDW48UG",
    title: "Beverage Voucher",
    status: "active",
    release_date: "2026-02-24T10:00:00Z",
    expiry_date: "2026-12-31T23:59:59Z",
    quantity: 100,
    remaining_quantity: 99,
    usage_count: 1,
    usage_rate_percent: 100.0,
    total_discount_amount: 10000.0,
    revenue_impacted: 85000.0
  }
];

const topVouchersData = {
  most_used: performanceData.sort((a, b) => b.usage_count - a.usage_count),
  highest_revenue: performanceData.sort((a, b) => b.revenue_impacted - a.revenue_impacted)
};

// --- UTILS ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// --- COMPONENT CHÍNH ---
export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê Voucher</h2>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu (Gross)</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overviewData.gross_revenue)}</div>
            <p className="text-xs text-muted-foreground">Net: {formatCurrency(overviewData.net_revenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Tiền Giảm Giá</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              -{formatCurrency(overviewData.total_discount_amount)}
            </div>
            <p className="text-xs text-muted-foreground">Chi phí khuyến mãi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tỉ Lệ Sử Dụng</CardTitle>
            <Percent className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.usage_rate_percent}%</div>
            <p className="text-xs text-muted-foreground">
              {overviewData.total_used} / {overviewData.total_assigned} voucher đã phân bổ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Voucher Đang Có</CardTitle>
            <Ticket className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.total_vouchers}</div>
            <p className="text-xs text-muted-foreground">Chiến dịch đang chạy</p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS & TOP VOUCHERS */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* CHART TỔNG QUAN */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Biểu đồ sử dụng & Giảm giá</CardTitle>
            <CardDescription>Biến động số lượt dùng và tiền giảm giá theo thời gian</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickFormatter={(val) => formatDate(val)}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} lượt`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    labelFormatter={(label) => formatDate(label)}
                    formatter={(value: any, name: string | number | undefined) => {
                      if (name === "Số lượt dùng") {
                        return [value, name];
                      }
                      // Ép kiểu value về number cho hàm formatCurrency nếu cần
                      return [formatCurrency(Number(value)), name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="usage_count" name="Số lượt dùng" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="discount_amount" name="Tiền giảm giá" stroke="#ef4444" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* TOP VOUCHERS TABS */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Vouchers</CardTitle>
            <CardDescription>Voucher hoạt động hiệu quả nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="most_used" className="space-y-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="most_used">Sử dụng nhiều</TabsTrigger>
                <TabsTrigger value="highest_revenue">Tạo doanh thu</TabsTrigger>
              </TabsList>

              <TabsContent value="most_used" className="space-y-4">
                {topVouchersData.most_used.map((voucher) => (
                  <div key={voucher.voucher_id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{voucher.title}</p>
                      <p className="text-xs text-muted-foreground">{voucher.code}</p>
                    </div>
                    <div className="font-medium text-sm">
                      {voucher.usage_count} lượt
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="highest_revenue" className="space-y-4">
                {topVouchersData.highest_revenue.map((voucher) => (
                  <div key={voucher.voucher_id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{voucher.title}</p>
                      <p className="text-xs text-muted-foreground">{voucher.code}</p>
                    </div>
                    <div className="font-medium text-sm text-green-600">
                      {formatCurrency(voucher.revenue_impacted)}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* PERFORMANCE TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết hiệu suất Voucher</CardTitle>
          <CardDescription>Báo cáo danh sách tất cả các voucher đang hoạt động</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã / Tên Voucher</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead className="text-right">Đã dùng / Tổng</TableHead>
                <TableHead className="text-right">Tỉ lệ</TableHead>
                <TableHead className="text-right">Tổng Giảm Giá</TableHead>
                <TableHead className="text-right">Tác động Doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((item) => (
                <TableRow key={item.voucher_id}>
                  <TableCell>
                    <div className="font-medium">{item.code}</div>
                    <div className="text-xs text-muted-foreground">{item.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(item.release_date)}</div>
                    <div className="text-xs text-muted-foreground">đến {formatDate(item.expiry_date)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.usage_count} / {item.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.usage_rate_percent > 0 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.usage_rate_percent}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-red-500 font-medium">
                    {item.total_discount_amount > 0 ? `-${formatCurrency(item.total_discount_amount)}` : '0 ₫'}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {formatCurrency(item.revenue_impacted)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}