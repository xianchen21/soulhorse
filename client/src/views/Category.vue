<template>
  <div class="page-container">
    <van-nav-bar title="分类" />

    <div class="category-wrapper">
      <!-- 分类侧边栏 -->
      <div class="category-sidebar">
        <div
          v-for="item in categories"
          :key="item.id"
          :class="['sidebar-item', { active: currentCategory === item.id }]"
          @click="currentCategory = item.id"
        >
          {{ item.name }}
        </div>
      </div>

      <!-- 分类内容 -->
      <div class="category-content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div v-if="contentList.length" class="content-list">
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
                  <span>{{ item.publishTime }}</span>
                  <span>浏览 {{ item.viewCount }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <van-empty description="该分类暂无内容" />
          </div>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryList, getContentList } from '@/api'

const route = useRoute()

const activeTab = ref(1)
const categories = ref([])
const currentCategory = ref(null)
const contentList = ref([])
const refreshing = ref(false)
const page = ref(1)

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data || []
    if (categories.value.length && !currentCategory.value) {
      currentCategory.value = route.params.id || categories.value[0].id
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchContent = async () => {
  if (!currentCategory.value) return
  try {
    const res = await getContentList({ categoryId: currentCategory.value, page: 1 })
    contentList.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const onRefresh = async () => {
  page.value = 1
  await fetchContent()
  refreshing.value = false
}

watch(currentCategory, () => {
  fetchContent()
})

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-wrapper {
  display: flex;
  height: calc(100vh - 100px);
  margin-bottom: 50px;
}

.category-sidebar {
  width: 100px;
  background: #f5f5f5;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-item {
  padding: 16px 12px;
  font-size: 14px;
  color: #666;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
}

.sidebar-item.active {
  background: #fff;
  color: var(--primary-color);
  font-weight: 500;
}

.category-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: #fff;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-card {
  display: flex;
  background: #f9f9f9;
  border-radius: 8px;
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
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.card-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
</style>
