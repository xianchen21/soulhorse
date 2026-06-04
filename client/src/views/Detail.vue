<template>
  <div class="page-container detail-page">
    <van-nav-bar
      left-arrow
      fixed
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="share-o" size="22" @click="onShare" />
      </template>
    </van-nav-bar>

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner">加载中...</van-loading>
    </div>

    <template v-else-if="content">
      <!-- 封面图 -->
      <div class="detail-cover">
        <img :src="content.cover" :alt="content.title" />
      </div>

      <!-- 内容区域 -->
      <div class="detail-content">
        <h1 class="detail-title">{{ content.title }}</h1>
        <div class="detail-meta">
          <span>{{ content.publishTime }}</span>
          <span>浏览 {{ content.viewCount }}</span>
        </div>
        <div class="detail-body" v-html="content.body"></div>
      </div>

      <!-- 相关推荐 -->
      <div v-if="relatedList.length" class="related-section">
        <div class="section-title">相关推荐</div>
        <div class="related-list">
          <div
            v-for="item in relatedList"
            :key="item.id"
            class="related-item"
            @click="$router.push(`/detail/${item.id}`)"
          >
            <img :src="item.cover" class="related-cover" />
            <div class="related-info">
              <div class="related-title text-ellipsis-2">{{ item.title }}</div>
              <div class="related-meta">{{ item.publishTime }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部工具栏 -->
      <div class="detail-toolbar">
        <div class="toolbar-item" @click="toggleCollect">
          <van-icon :name="isCollected ? 'star' : 'star-o'" :color="isCollected ? '#F59E0B' : ''" />
          <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
        </div>
        <div class="toolbar-item" @click="$router.push('/browse-history')">
          <van-icon name="clock-o" />
          <span>浏览记录</span>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <van-empty description="内容不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContentDetail, toggleCollect as apiToggleCollect } from '@/api'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const content = ref(null)
const relatedList = ref([])
const isCollected = ref(false)

const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await getContentDetail(route.params.id)
    content.value = res.data.content
    relatedList.value = res.data.related || []
    isCollected.value = res.data.isCollected || false
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const toggleCollect = async () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  try {
    const res = await apiToggleCollect({
      contentId: content.value.id,
      action: isCollected.value ? 'remove' : 'add'
    })
    isCollected.value = !isCollected.value
    showToast(isCollected.value ? '收藏成功' : '取消收藏')
  } catch (e) {
    console.error(e)
  }
}

const onShare = () => {
  if (navigator.share) {
    navigator.share({
      title: content.value.title,
      text: content.value.summary,
      url: window.location.href
    })
  } else {
    showToast('链接已复制')
    navigator.clipboard.writeText(window.location.href)
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.detail-page {
  padding-bottom: 60px;
}

.detail-cover {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}

.detail-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.detail-body {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

.detail-body :deep(img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 12px 0;
}

.related-section {
  padding: 16px;
  background: #fff;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.related-cover {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-title {
  font-size: 14px;
  color: #333;
}

.related-meta {
  font-size: 12px;
  color: #999;
}

.detail-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  z-index: 100;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}
</style>
