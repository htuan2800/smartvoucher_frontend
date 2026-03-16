import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

type LoginPayload = {
	username: string
	password: string
}

type TokenResponse = {
	access: string
	refresh: string
}

type RefreshResponse = {
	access: string
	refresh?: string
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean
}

const isBrowser = typeof window !== 'undefined'

const getAccessToken = () => (isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null)
const getRefreshToken = () => (isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null)

const saveTokens = (tokens: { access: string; refresh?: string }) => {
	if (!isBrowser) return

	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
	if (tokens.refresh) {
		localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
	}
}

const clearTokens = () => {
	if (!isBrowser) return
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async () => {
	if (refreshPromise) {
		return refreshPromise
	}

	const refresh = getRefreshToken()
	if (!refresh) {
		throw new Error('Missing refresh token')
	}

	refreshPromise = axios
		.post<RefreshResponse>(`${API_BASE_URL}/api/users/refresh/`, { refresh })
		.then((res) => {
			const nextAccess = res.data.access
			saveTokens({ access: nextAccess, refresh: res.data.refresh })
			return nextAccess
		})
		.finally(() => {
			refreshPromise = null
		})

	return refreshPromise
}

api.interceptors.request.use((config) => {
	const token = getAccessToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableRequestConfig | undefined
		const requestUrl = originalRequest?.url || ''

		const shouldSkipRefresh = requestUrl.includes('/api/users/login/') || requestUrl.includes('/api/users/refresh/')

		if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !shouldSkipRefresh) {
			originalRequest._retry = true

			try {
				const newAccessToken = await refreshAccessToken()
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return api(originalRequest)
			} catch {
				clearTokens()
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	},
)

export const authApi = {
	async login(payload: LoginPayload) {
		const response = await api.post<TokenResponse>('/api/users/login/', payload)
		saveTokens(response.data)
		return response.data
	},
	logout() {
		clearTokens()
	},
	getAccessToken,
	getRefreshToken,
}

export const userApi = {
	me: async () => (await api.get('/api/users/me/')).data,
	staff: async () => (await api.get('/api/users/staff/')).data,
	customers: async () => (await api.get('/api/users/customers/')).data,
	permissions: async () => (await api.get('/api/users/permissions/')).data,
}

export const orderApi = {
	sync: async (payload: unknown) => (await api.post('/api/orders/sync/', payload)).data,
	cancel: async (payload: unknown) => (await api.post('/api/orders/cancel/', payload)).data,
}

export const voucherApi = {
	apply: async (payload: unknown) => (await api.post('/api/vouchers/apply/', payload)).data,
	confirm: async (payload: unknown) => (await api.post('/api/vouchers/confirm/', payload)).data,
	statsOverview: async () => (await api.get('/api/vouchers/stats/overview/')).data,
	statsRevenueChart: async (params: { group_by: string; start_date?: string; end_date?: string }) =>
		(await api.get('/api/vouchers/stats/revenue-chart/', { params })).data,
	topVouchers: async (params: { start_date: string; end_date: string; limit?: number }) =>
		(await api.get('/api/vouchers/stats/top-vouchers/', { params })).data,
	performance: async (params: { start_date: string; end_date: string; ordering?: string }) =>
		(await api.get('/api/vouchers/stats/performance/', { params })).data,
}

export default api