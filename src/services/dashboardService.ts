import { voucherApi } from './apiService';
export const DashboardService = {
    getDashboardStats: async () => {
        return voucherApi.statsOverview();

    },

    getRevenueStats: async (startDate: string, endDate: string, groupBy: string) => {
        return voucherApi.statsRevenueChart({
            group_by: groupBy,
            start_date: startDate,
            end_date: endDate,
        });
    }
}
