<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <van-nav-bar>
      <template #left>
        <div class="logo" @click="$router.push('/')">
          <img src="/logo.png" alt="logo" class="logo-img" />
        </div>
      </template>
      <template #title>
        <div class="search-box" @click="$router.push('/search')">
          <van-icon name="search" />
          <span>输入关键词搜索内容</span>
        </div>
      </template>
      <template #right>
        <van-badge :content="unreadCount" :show-zero="false" max="99">
          <div class="message-icon" @click="$router.push('/messages')">
            <van-icon name="bell" size="22" />
          </div>
        </van-badge>
      </template>
    </van-nav-bar>

    <!-- 内容区域 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="content-wrapper">
        <!-- Banner轮播 -->
        <div v-if="banners.length" class="banner-section">
          <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item
              v-for="item in banners"
              :key="item.id"
              @click="handleBannerClick(item)"
            >
              <img :src="item.image" :alt="item.title" class="banner-img" />
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 快捷功能入口 -->
        <div v-if="quickEntries.length" class="quick-entry-section">
          <div class="quick-entry-grid">
            <div
              v-for="entry in quickEntries"
              :key="entry.id"
              class="quick-entry-item"
              @click="handleQuickEntry(entry)"
            >
              <img :src="entry.icon" class="entry-icon" />
              <span class="entry-name">{{ entry.name }}</span>
            </div>
          </div>
        </div>

        <!-- 内容推荐列表 -->
        <div class="content-section">
          <div class="section-title">热门推荐</div>
          <div class="content-list">
            <div
              v-for="item in contentList"
              :key="item.id"
              class="content-card"
              @click="$router.push(`/detail/${item.id}`)"
            >
              <img :src="item.cover" class="card-cover" />
              <div class="card-content">
                <div class="card-title text-ellipsis-2">{{ item.title }}</div>
                <div class="card-desc text-ellipsis">{{ item.summary }}</div>
                <div class="card-meta">
                  <span class="publish-time">{{ item.publishTime }}</span>
                  <van-icon name="eye-o" />
                  <span>{{ item.viewCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <van-loading type="spinner">加载中...</van-loading>
          </div>
          <div v-else-if="!contentList.length" class="empty-state">
            <van-empty description="暂无内容" />
          </div>
          <div v-else-if="noMore" class="loading-container">
            <span style="color: #999">没有更多了</span>
          </div>
        </div>
      </div>
    </van-pull-refresh>

    <!-- 底部导航 -->
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHomeData } from '@/api'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const activeTab = ref(0)
const refreshing = ref(false)
const loading = ref(false)
const noMore = ref(false)
const banners = ref([])
const quickEntries = ref([])
const contentList = ref([])
const page = ref(1)

const unreadCount = ref(0)

const onRefresh = async () => {
  page.value = 1
  noMore.value = false
  await fetchHomeData()
  refreshing.value = false
}

const fetchHomeData = async () => {
  try {
    loading.value = true
    const res = await getHomeData()
    banners.value = res.data.banners || []
    quickEntries.value = res.data.quickEntries || []
    contentList.value = res.data.contents || []
    unreadCount.value = res.data.unreadCount || 0
    appStore.setUnreadCount(unreadCount.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loading.value || noMore.value) return
  try {
    loading.value = true
    page.value++
    const res = await getHomeData()
    const newList = res.data.contents || []
    if (newList.length === 0) {
      noMore.value = true
    } else {
      contentList.value = [...contentList.value, ...newList]
    }
  } catch (e) {
    page.value--
  } finally {
    loading.value = false
  }
}

const handleBannerClick = (item) => {
  if (item.linkType === 'h5' && item.linkUrl) {
    window.location.href = item.linkUrl
  } else if (item.linkType === 'page' && item.linkUrl) {
    router.push(item.linkUrl)
  }
}

const handleQuickEntry = (entry) => {
  if (entry.linkUrl) {
    router.push(entry.linkUrl)
  }
}

onMounted(() => {
  fetchHomeData()

  // 监听滚动加载更多
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    if (scrollTop + windowHeight >= docHeight - 200) {
      loadMore()
    }
  })
})
</script>

<style scoped>
.logo-img {
  width: 36px;
  height: 36px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 16px;
  color: #fff;
  font-size: 13px;
}

.message-icon {
  padding: 4px;
}

.content-wrapper {
  padding-bottom: 60px;
}

.banner-section {
  margin-bottom: 12px;
}

.banner-swipe {
  height: 180px;
}

.banner-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.quick-entry-section {
  background: #fff;
  padding: 16px 12px;
  margin-bottom: 12px;
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.quick-entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.entry-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.entry-name {
  font-size: 12px;
  color: #666;
}

.content-section {
  padding: 0 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-card {
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
  gap: 12px;
}

.card-cover {
  width: 100px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 6px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}
</style>
