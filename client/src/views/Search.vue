<template>
  <div class="page-container">
    <van-nav-bar
      title="搜索"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 搜索框 -->
    <div class="search-header">
      <van-search
        v-model="keyword"
        placeholder="输入关键词搜索内容"
        show-action
        @search="onSearch"
        @clear="onClear"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <!-- 搜索历史 -->
    <div v-if="!keyword && searchHistory.length" class="search-history">
      <div class="history-header">
        <span>搜索历史</span>
        <van-icon name="delete-o" @click="clearHistory" />
      </div>
      <div class="history-tags">
        <van-tag
          v-for="item in searchHistory"
          :key="item"
          size="large"
          round
          @click="keyword = item"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="hasSearched" class="search-results">
      <div v-if="results.length" class="result-list">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-item"
          @click="$router.push(`/detail/${item.id}`)"
        >
          <img :src="item.cover" class="item-cover" />
          <div class="item-content">
            <div class="item-title text-ellipsis-2">{{ item.title }}</div>
            <div class="item-summary text-ellipsis">{{ item.summary }}</div>
            <div class="item-meta">
              <span>{{ item.publishTime }}</span>
              <span>浏览 {{ item.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-empty description="暂无相关内容，换个关键词试试" />
      </div>
    </div>

    <!-- 搜索建议 -->
    <div v-else-if="keyword && suggestions.length" class="suggestions">
      <div
        v-for="item in suggestions"
        :key="item"
        class="suggestion-item"
        @click="keyword = item"
      >
        <van-icon name="search" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { searchContent, getSearchSuggestions } from '@/api'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const keyword = ref('')
const searchHistory = ref([])
const results = ref([])
const suggestions = ref([])
const hasSearched = ref(false)
let searchTimer = null

const onSearch = () => {
  if (!keyword.value.trim()) return
  appStore.addSearchHistory(keyword.value.trim())
  fetchSearchResults()
  hasSearched.value = true
}

const onClear = () => {
  results.value = []
  suggestions.value = []
  hasSearched.value = false
}

const clearHistory = () => {
  appStore.clearSearchHistory()
  searchHistory.value = []
}

const fetchSearchResults = async () => {
  try {
    const res = await searchContent({ keyword: keyword.value, page: 1 })
    results.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const fetchSuggestions = async () => {
  if (!keyword.value.trim()) {
    suggestions.value = []
    return
  }
  try {
    const res = await getSearchSuggestions(keyword.value)
    suggestions.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

watch(keyword, (val) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    if (!hasSearched.value) {
      fetchSuggestions()
    }
  }, 300)
})

watch(() => appStore.searchHistory, (val) => {
  searchHistory.value = val
}, { immediate: true })
</script>

<style scoped>
.search-header {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-history {
  padding: 16px;
  background: #fff;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestions {
  background: #fff;
  padding: 0 16px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  color: #666;
}

.suggestions .suggestion-item:last-child {
  border-bottom: none;
}

.search-results {
  padding: 12px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  gap: 12px;
}

.item-cover {
  width: 100px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.item-summary {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
</style>
