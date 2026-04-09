import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

const api = axios.create({
	baseURL,
	timeout: 120000,
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers = config.headers || {}
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === 'ECONNABORTED') {
			error.message = 'The API request took too long to respond. Check whether your backend is running and VITE_API_URL is correct.'
		} else if (!error.response) {
			error.message = 'Unable to reach the API. Check your backend URL and network connection.'
		}

		return Promise.reject(error)
	}
)

export const login = (payload) => api.post('/auth/login', payload)
export const register = (payload) => api.post('/auth/register', payload)
export const getFeeds = () => api.get('/feeds')
export const getFolders = () => api.get('/folders')
export const addFeed = (payload) => api.post('/feeds', payload)
export const deleteFeed = (id) => api.delete(`/feeds/${id}`)
export const getArticles = () => api.get('/articles')
export const searchArticles = (query) => api.get(`/articles/search?q=${encodeURIComponent(query)}`)
export const generateSummary = (payload) => api.post('/summary', payload)

export default api
