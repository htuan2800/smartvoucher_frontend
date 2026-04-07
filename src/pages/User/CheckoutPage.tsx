import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Phone,
  User as UserIcon,
  Ticket,
  CheckCircle2,
  X,
  CreditCard,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Voucher = {
  id: number
  code: string
  title: string
  type: 'fixed' | 'percent'
  value: number
  minSpend: number
}

const mockVouchers: Voucher[] = [
  { id: 1, code: 'WELCOME50', title: 'Giảm 50K cho đơn từ 100K', type: 'fixed', value: 50000, minSpend: 100000 },
  { id: 2, code: 'FREESHIP', title: 'Miễn phí vận chuyển (Tối đa 30K)', type: 'fixed', value: 30000, minSpend: 0 },
  { id: 3, code: 'VIP10', title: 'Giảm 10% toàn bộ đơn hàng', type: 'percent', value: 10, minSpend: 200000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  // Form State
  const [formData, setFormData] = useState({ fullName: user?.username || '', phone: '', address: '' })
  
  // Voucher State
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
    if (cartItems.length === 0) navigate('/shop')
  }, [user, cartItems, navigate])

  // Logic Tính toán Tiền
  const discountAmount = useMemo(() => {
    if (!selectedVoucher) return 0
    if (selectedVoucher.type === 'fixed') return selectedVoucher.value
    if (selectedVoucher.type === 'percent') return (cartTotal * selectedVoucher.value) / 100
    return 0
  }, [selectedVoucher, cartTotal])

  const finalTotal = cartTotal - discountAmount > 0 ? cartTotal - discountAmount : 0

  // Chọn Voucher
  const handleSelectVoucher = (voucher: Voucher) => {
    if (cartTotal < voucher.minSpend) {
      toast.error(`Đơn hàng chưa đạt mức tối thiểu ${formatCurrency(voucher.minSpend)}`)
      return
    }
    setSelectedVoucher(voucher)
    setIsVoucherModalOpen(false)
  }

  // Xử lý Đặt hàng
  const handlePlaceOrder = () => {
    if (!formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ số điện thoại và địa chỉ nhận hàng!')
      return
    }
    
    setIsProcessing(true)
    
    setTimeout(() => {
      setIsProcessing(false)
      clearCart() // Đặt hàng xong thì xóa sạch giỏ hàng
      toast.success('Đặt hàng thành công! Mã đơn của bạn là #ORD-' + Math.floor(Math.random() * 10000))
      navigate('/shop')
    }, 2000)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500/30 pb-24">
      {/* Premium Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8 pt-10">
        
        <button onClick={() => navigate('/cart')} className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors mb-8">
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Quay lại giỏ hàng
        </button>

        <h1 className="text-4xl font-black tracking-tight mb-10">Thanh toán an toàn</h1>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" /> Thông tin giao hàng
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Họ và tên người nhận</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full h-12 pl-12 pr-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="Nhập họ và tên..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Số điện thoại liên hệ</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-12 pl-12 pr-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Địa chỉ nhận hàng</label>
                  <textarea 
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT & VOUCHER */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 p-8 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 shadow-2xl">
              
              {/* VOUCHER SECTION */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Mã giảm giá (Voucher)</h3>
                <button 
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="w-full h-14 px-4 bg-[#0f172a] border border-cyan-500/30 rounded-2xl hover:border-cyan-400 hover:bg-cyan-500/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className={`w-5 h-5 ${selectedVoucher ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    <span className={`font-semibold ${selectedVoucher ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'}`}>
                      {selectedVoucher ? selectedVoucher.code : 'Chọn mã giảm giá...'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

              {/* TÓM TẮT ĐƠN */}
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" /> Tóm tắt đơn hàng
              </h3>

              <div className="space-y-4 mb-6 text-sm font-semibold text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Tạm tính ({cartItems.length} món)</span>
                  <span className="text-white">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Giảm giá Voucher</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/10">
                <span className="font-bold text-slate-300">Tổng thanh toán</span>
                <div className="text-right">
                  <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full h-14 bg-white text-slate-900 hover:bg-cyan-400 hover:text-white font-black text-lg rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/50 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Hoàn Tất Đặt Hàng'
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* List Voucher*/}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <>
            {/* Lớp nền mờ (Backdrop) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsVoucherModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Khung Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-cyan-900/50 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-cyan-400" /> Smart Voucher
                </h3>
                <button onClick={() => setIsVoucherModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Danh sách Voucher (Scrollable) */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                {mockVouchers.map((voucher) => {
                  const isEligible = cartTotal >= voucher.minSpend
                  const isSelected = selectedVoucher?.id === voucher.id

                  return (
                    <div 
                      key={voucher.id}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                          : isEligible 
                            ? 'bg-white/[0.03] border-white/10 hover:border-white/30 cursor-pointer' 
                            : 'bg-white/[0.01] border-white/5 opacity-50 grayscale cursor-not-allowed'
                      }`}
                      onClick={() => isEligible && handleSelectVoucher(voucher)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-3 py-1 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                          {voucher.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                      </div>
                      <h4 className="font-bold text-white mb-1">{voucher.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">
                        Đơn tối thiểu: {formatCurrency(voucher.minSpend)}
                      </p>
                      
                      {/* Vết cắt trang trí (Răng cưa voucher) */}
                      <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#020617] rounded-full border-r border-white/10" />
                      <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-[#020617] rounded-full border-l border-white/10" />
                    </div>
                  )
                })}
              </div>

              {/* Footer Modal (Bỏ chọn) */}
              {selectedVoucher && (
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                  <Button 
                    onClick={() => { setSelectedVoucher(null); setIsVoucherModalOpen(false) }}
                    variant="outline" 
                    className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl h-12 font-bold"
                  >
                    Bỏ chọn mã giảm giá
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}