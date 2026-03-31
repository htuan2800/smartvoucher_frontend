import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  CheckCircle2, 
  Gift, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { voucherApi } from '@/services/apiService'

const featureItems = [
  {
    title: 'Marketing Flow Automation',
    description: 'Biến ý tưởng thành chiến dịch trong tích tắc với chuỗi quy tắc phân bổ tự động và thông minh.',
    icon: Rocket,
    color: 'from-cyan-400 to-blue-600',
    shadow: 'shadow-cyan-500/20',
    delay: 0.1
  },
  {
    title: 'Data-Driven Intelligence',
    description: 'Vượt xa những con số cơ bản. Thấu hiểu hành vi khách hàng và tối ưu hóa từng đồng ngân sách marketing.',
    icon: BarChart3,
    color: 'from-indigo-400 to-purple-600',
    shadow: 'shadow-indigo-500/20',
    delay: 0.2
  },
  {
    title: 'Elite Security Core',
    description: 'Bảo vệ lợi thế cạnh tranh với hệ thống chống gian lận đa tầng và mã hóa token chuẩn quốc tế.',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    delay: 0.3
  },
]

type OverviewStats = {
  total_used?: number
  net_revenue?: number
  usage_rate_percent?: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function HomePage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchPublicStats = async () => {
      try {
        const overviewData = await voucherApi.statsOverview()
        if (isMounted) setOverview(overviewData)
      } catch { /* Fail silently */ }
    }
    fetchPublicStats()
    return () => { isMounted = false }
  }, [])

  const heroStats = useMemo(
    () => [
      {
        label: 'Voucher Đã Dùng',
        value: overview?.total_used?.toLocaleString('vi-VN') || '1,492',
        icon: CheckCircle2,
        color: 'text-emerald-400',
        glow: 'bg-emerald-500/20',
        border: 'border-emerald-500/20'
      },
      {
        label: 'Doanh Thu Tác Động',
        value: typeof overview?.net_revenue === 'number' ? formatCurrency(overview.net_revenue) : '1.2B VND',
        icon: TrendingUp,
        color: 'text-cyan-400',
        glow: 'bg-cyan-500/20',
        border: 'border-cyan-500/20'
      },
      {
        label: 'Tỷ Lệ Chuyển Đổi',
        value: typeof overview?.usage_rate_percent === 'number' ? `${overview.usage_rate_percent}%` : '64.2%',
        icon: Zap,
        color: 'text-indigo-400',
        glow: 'bg-indigo-500/20',
        border: 'border-indigo-500/20'
      },
    ],
    [overview],
  )

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
      {/* Premium Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-cyan-600/10 blur-[130px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-600/10 blur-[130px]" 
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Navigation */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between py-10"
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-900/40 group-hover:scale-110 transition-transform">
              <Gift className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SmartVoucher</h2>
              <div className="flex items-center gap-1.5 opacity-60">
                <Globe className="w-2.5 h-2.5 text-cyan-500" />
                <p className="text-[10px] uppercase font-bold tracking-widest">Enterprise Elite</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild size="lg" className="h-11 px-6 bg-transparent border border-white/20 text-white hover:bg-white/10 transition-all duration-300 font-bold rounded-full">
              <Link to="/register">Đăng ký thành viên</Link>
            </Button>
            <Button asChild size="lg" className="h-11 px-6 bg-white text-slate-900 hover:bg-cyan-500 hover:text-white transition-all duration-300 font-bold rounded-full group">
              <Link to="/admin/login" className="flex items-center gap-2">Admin Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="pt-16 pb-24 text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Next-Gen Management Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8"
          >
            Tái định nghĩa<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent italic">Kinh tế Voucher.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Khai phá sức mạnh của phân phối thông minh, phân tích dữ liệu chuyên sâu và bảo mật cấp doanh nghiệp. Nâng tầm trải nghiệm khách hàng với hệ thống ưu đãi thế hệ mới.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-cyan-600/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-100" />
              <Button asChild size="lg" className="relative h-16 px-10 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xl rounded-2xl shadow-2xl transition-all">
                <Link to="/register">Đăng ký Hội Viên</Link>
              </Button>
            </div>
            <Button asChild size="lg" variant="outline" className="h-16 px-10 bg-white/5 hover:bg-white/10 text-white border-white/10 font-black text-xl rounded-2xl transition-all">
               <Link to="/admin/login">Dành cho Admin</Link>
            </Button>
          </motion.div>
        </section>

        {/* Dynamic Stats Section */}
        <section className="pb-32 grid md:grid-cols-3 gap-8">
          {heroStats.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-[2.5rem] border ${item.border} bg-white/[0.03] backdrop-blur-2xl group transition-all duration-500`}
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="w-24 h-24" />
                </div>
                
                <div className={`inline-flex p-4 rounded-2xl ${item.glow} mb-8 shadow-inner`}>
                  <Icon className={`w-8 h-8 ${item.color} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">{item.label}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black tracking-tight text-white">{item.value}</p>
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  </div>
                </div>
                
                <div className="mt-8 h-px w-0 group-hover:w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transition-all duration-700" />
              </motion.div>
            )
          })}
        </section>

        {/* Bento-Inspired Feature Section */}
        <section className="pb-40">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Feature Ecosystem</h2>
            <div className="h-1 w-12 bg-cyan-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featureItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay }}
                  className={`group relative p-10 rounded-[3rem] bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 ${item.shadow} hover:shadow-2xl`}
                >
                  <div className={`mb-10 h-16 w-16 flex items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} shadow-lg relative overflow-hidden group-hover:rotate-6 transition-transform`}>
                    <Icon className="h-8 w-8 text-white relative z-10" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{item.description}</p>
                  
                  <div className="mt-10 flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase cursor-pointer opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-20 border-t border-white/5">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <div className="h-2 w-2 rounded-full bg-cyan-500" />
                   <span className="font-black text-xl text-white tracking-tighter uppercase">SmartVoucher</span>
                </div>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-600">Premium Management Systems</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <a href="#" className="hover:text-cyan-400 transition-all">Architecture</a>
                 <a href="#" className="hover:text-cyan-400 transition-all">Privacy</a>
                 <a href="#" className="hover:text-cyan-400 transition-all">Source</a>
              </div>

              <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                © 2024 VUE STUDIO X
              </div>
           </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s infinite ease-in-out;
        }
      `}} />
    </div>
  )
}
