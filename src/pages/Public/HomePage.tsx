import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, CheckCircle2, ClipboardCheck, Gift, ShieldCheck, Sparkles, TicketPercent, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { authApi, voucherApi } from '@/services/apiService'

const featureItems = [
  {
    title: 'Tao voucher theo chien dich',
    description: 'Thiet lap quy tac giam gia, dieu kien ap dung va so luong voucher theo tung nhom khach hang.',
    icon: TicketPercent,
  },
  {
    title: 'Theo doi hieu suat theo thoi gian thuc',
    description: 'Dashboard cap nhat luot su dung, doanh thu tac dong va chi phi khuyen mai de ra quyet dinh nhanh.',
    icon: BarChart3,
  },
  {
    title: 'Dong bo don hang tu he thong ban',
    description: 'Ket noi va dong bo du lieu don hang de danh gia voucher theo tung kenh ban va tung khung gio.',
    icon: ClipboardCheck,
  },
  {
    title: 'Bao mat vai tro admin ro rang',
    description: 'Quan ly token, phan quyen nhan vien va theo doi lich su hanh dong trong khu vuc quan tri.',
    icon: ShieldCheck,
  },
]

const processItems = [
  {
    title: 'Buoc 1: Khoi tao chuong trinh',
    detail: 'Tao ma voucher, thoi gian hieu luc va ngan sach khuyen mai.',
  },
  {
    title: 'Buoc 2: Phan phoi thong minh',
    detail: 'Gui voucher dung nhom khach hang dua tren hanh vi va lich su mua.',
  },
  {
    title: 'Buoc 3: Toi uu lien tuc',
    detail: 'Theo doi data va dieu chinh chien dich ngay trong admin dashboard.',
  },
]

type OverviewStats = {
  total_used?: number
  net_revenue?: number
  usage_rate_percent?: number
}

type TopVoucher = {
  voucher_id: number
  title: string
  code: string
  usage_count?: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const getCurrentMonthRange = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const toIso = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return {
    start: toIso(first),
    end: toIso(last),
  }
}

export default function HomePage() {
  const isLoggedIn = Boolean(authApi.getAccessToken())
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [topVouchers, setTopVouchers] = useState<TopVoucher[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchPublicStats = async () => {
      setLoadingStats(true)
      setStatsError(null)

      try {
        const range = getCurrentMonthRange()
        const [overviewData, topData] = await Promise.all([
          voucherApi.statsOverview(),
          voucherApi.topVouchers({
            start_date: range.start,
            end_date: range.end,
            limit: 3,
          }),
        ])

        if (!isMounted) return
        setOverview(overviewData)
        setTopVouchers(topData?.top_vouchers?.most_used || [])
      } catch {
        if (!isMounted) return
        setStatsError('Khong the tai du lieu realtime. Vui long dang nhap admin de xem day du.')
      } finally {
        if (isMounted) {
          setLoadingStats(false)
        }
      }
    }

    fetchPublicStats()

    return () => {
      isMounted = false
    }
  }, [])

  const heroStats = useMemo(
    () => [
      {
        label: 'Voucher da su dung hom nay',
        value: overview?.total_used?.toLocaleString('vi-VN') || '1,284',
        icon: CheckCircle2,
        color: 'text-emerald-600',
      },
      {
        label: 'Doanh thu tac dong',
        value: typeof overview?.net_revenue === 'number' ? formatCurrency(overview.net_revenue) : '620M VND',
        icon: BarChart3,
        color: 'text-cyan-700',
      },
      {
        label: 'Ty le su dung voucher',
        value: typeof overview?.usage_rate_percent === 'number' ? `${overview.usage_rate_percent}%` : '42%',
        icon: Users2,
        color: 'text-amber-600',
      },
    ],
    [overview],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#d9f3ff_0%,#eff8ff_34%,#fffdf6_70%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-cyan-200/70 blur-3xl" />
        <div className="absolute right-0 top-8 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-12 pt-8 md:px-10 md:pt-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-600">SMART VOUCHER</p>
              <p className="text-sm font-semibold">Voucher Management Platform</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="bg-white/80">
              <Link to="/admin/login">Admin Login</Link>
            </Button>
            {isLoggedIn && (
              <Button asChild>
                <Link to="/admin">Mo Dashboard</Link>
              </Button>
            )}
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="grid items-center gap-6 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-8"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
              <Sparkles className="h-3.5 w-3.5" />
              Nen tang quan li voucher thong minh
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Tang doanh thu tu khuyen mai, khong tang chi phi lang phi.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
              Smart Voucher giup doanh nghiep tao, theo doi va toi uu voucher tren cung mot man hinh quan tri.
              Team marketing thay duoc hieu qua ngay, team van hanh giam loi khi ap dung khuyen mai.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-sm">
                <Link to="/admin/login">Dang nhap quan tri</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white">
                <Link to="/admin">Xem dashboard mau</Link>
              </Button>
            </div>
            {loadingStats && <p className="mt-3 text-xs text-slate-500">Dang dong bo du lieu tu backend...</p>}
            {statsError && <p className="mt-3 text-xs text-amber-700">{statsError}</p>}
          </div>

          <div className="grid gap-3">
            {heroStats.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label} className="border-slate-200/80 bg-white/90 py-3">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-2xl font-semibold">{item.value}</p>
                    </div>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {featureItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + index * 0.07 }}
              >
                <Card className="h-full border-white/80 bg-white/85 py-4 shadow-sm backdrop-blur">
                  <CardContent>
                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2.5 text-slate-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 md:p-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Quy trinh van hanh de theo doi</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {processItems.map((step, idx) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Stage {idx + 1}</p>
                <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 md:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Top voucher thang nay</h2>
            <p className="text-xs text-slate-500">Nguon: /api/vouchers/stats/top-vouchers/</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {topVouchers.length > 0 ? (
              topVouchers.map((voucher) => (
                <Card key={voucher.voucher_id} className="border-slate-200/80 bg-white py-3">
                  <CardContent>
                    <p className="text-xs text-slate-500">{voucher.code}</p>
                    <h3 className="mt-1 text-base font-semibold">{voucher.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">Luot su dung: {voucher.usage_count || 0}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-slate-600 md:col-span-3">
                Chua co du lieu top voucher. Dang nhap admin de cap nhat va xem chi tiet.
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
