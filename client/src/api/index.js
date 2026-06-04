import request from './request'

// 首页数据
export const getHomeData = () => request.get('/home')

// 内容列表
export const getContentList = (params) => request.get('/content', { params })

// 内容详情
export const getContentDetail = (id) => request.get(`/content/${id}`)

// 搜索
export const searchContent = (params) => request.get('/search', { params })
export const getSearchSuggestions = (keyword) => request.get('/search/suggestions', { params: { keyword } })

// 用户登录
export const login = (data) => request.post('/user/login', data)

// 用户信息
export const getUserInfo = () => request.get('/user/info')

// 收藏列表
export const getCollections = (params) => request.get('/user/collections', { params })

// 收藏操作
export const toggleCollect = (data) => request.post('/user/collect', data)

// 浏览历史
export const getBrowseHistory = (params) => request.get('/user/history', { params })
export const deleteHistory = (id) => request.delete(`/user/history/${id}`)
export const clearHistory = () => request.delete('/user/history')

// 消息列表
export const getMessages = (params) => request.get('/messages', { params })
export const getUnreadCount = () => request.get('/messages/unread-count')

// ============ CMS管理接口 ============

// Banner管理
export const getBannerList = () => request.get('/admin/banners')
export const createBanner = (data) => request.post('/admin/banner', data)
export const updateBanner = (id, data) => request.put(`/admin/banner/${id}`, data)
export const deleteBanner = (id) => request.delete(`/admin/banner/${id}`)
export const toggleBannerStatus = (id) => request.patch(`/admin/banner/${id}/toggle`)

// 分类管理
export const getCategoryList = () => request.get('/admin/categories')
export const createCategory = (data) => request.post('/admin/category', data)
export const updateCategory = (id, data) => request.put(`/admin/category/${id}`, data)
export const deleteCategory = (id) => request.delete(`/admin/category/${id}`)
export const sortCategories = (ids) => request.put('/admin/categories/sort', { ids })

// 内容管理
export const getAdminContentList = (params) => request.get('/admin/content', { params })
export const createContent = (data) => request.post('/admin/content', data)
export const updateContent = (id, data) => request.put(`/admin/content/${id}`, data)
export const deleteContent = (id) => request.delete(`/admin/content/${id}`)
export const toggleContentStatus = (id) => request.patch(`/admin/content/${id}/toggle')

// 数据看板
export const getDashboardStats = () => request.get('/admin/stats')

// 埋点
export const trackEvent = (data) => request.post('/track', data)
