import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import VoucherForm from "@/components/admin/vouchers/VoucherForm"
import { voucherApi } from "@/services/apiService"
import type { Voucher } from "@/types/voucher"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui"

export default function VoucherEditPage() {
   const { voucherId } = useParams()
   const navigate = useNavigate()
   const [initialData, setInitialData] = useState<Voucher | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      if (!voucherId) return;

      const fetchVoucher = async () => {
         try {
            const data = await voucherApi.get(voucherId)
            setInitialData(data)
         } catch (error: any) {
            toast.error("Không tải được dữ liệu Voucher hiện tại.")
            console.error(error)
         } finally {
            setLoading(false)
         }
      }

      fetchVoucher()
   }, [voucherId])

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent animate-spin rounded-2xl shadow-xl shadow-indigo-100"></div>
            <div className="text-center text-slate-500 font-bold text-sm tracking-widest uppercase">Đang tải dữ liệu voucher...</div>
         </div>
      );
   }

   if (!initialData) {
      return (
         <div className="p-8 text-center flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy Voucher</h2>
            <Button onClick={() => navigate("/admin/vouchers/list")} variant="outline">
               <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
            </Button>
         </div>
      )
   }

   return <VoucherForm initialData={initialData} isEdit={true} />
}
