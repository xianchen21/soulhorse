<template>
  <div class="page-container">
    <van-nav-bar title="我的收藏" left-arrow @click-left="$router.back()" />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="list.length" class="collection-list">
        <div
          v-for="item in list"
          :key="item.id"
          class="collection-item"
        >
          <img :src="item.cover" class="item-cover" @click="$router.push(`/detail/${item.id}`)" />
          <div class="item-content">
            <div class="item-title text-ellipsis-2" @click="$router.push(`/detail/${item.id}`)">
              {{ item.title }}
            </div>
            <div class="item-meta">{{ item.collectTime }}</div>
          </div>
          <van-icon name="star" color="#F59E0B" @click="cancelCollect(item)" />
        </div>
      </div>
      <div v-else class="empty-state">
        <van-empty description="暂无收藏内容" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCollections, toggleCollect } from '@/api'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const userStore = useUserStore()

const list = ref([])
const refreshing = ref(false)

const fetchCollections = async () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  try {
    const res = await getCollections({ page: 1 })
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const cancelCollect = async (item) => {
  try {
    await toggleCollect({ contentId: item.id, action: 'remove' })
    list.value = list.value.filter(i => i.id !== item.id)
    showToast('已取消收藏')
  } catch (e) {
    console.error(e)
  }
}

const onRefresh = async () => {
  await fetchCollections()
  refreshing.value = false
}

onMounted(() => {
  fetchCollections()
})
</script>

<style scoped>
.collection-list {
  padding: 12px;
}

.collection-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.item-cover {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.item-meta {
  font-size: 12px;
  color: #999;
}
</style>
