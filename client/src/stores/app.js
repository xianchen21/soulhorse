import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    unreadCount: 0
  }),

  actions: {
    addSearchHistory(keyword) {
      if (!keyword) return
      const list = this.searchHistory.filter(item => item !== keyword)
      list.unshift(keyword)
      this.searchHistory = list.slice(0, 20)
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
    },

    clearSearchHistory() {
      this.searchHistory = []
      localStorage.removeItem('searchHistory')
    },

    setUnreadCount(count) {
      this.unreadCount = count
    }
  }
})
