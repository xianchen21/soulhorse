<template>
  <div class="page-container">
    <van-nav-bar
      title="浏览历史"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <span v-if="list.length" class="clear-btn" @click="onClear">清空</span>
      </template>
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="list.length" class="history-list">
        <div
          v-for="item in list"
          :key="item.id"
          class="history-item"
        >
          <img :src="item.cover" class="item-cover" @click="$router.push(`/detail/${item.id}`)" />
          <div class="item-content">
            <div class="item-title text-ellipsis-2" @click="$router.push(`/detail/${item.id}`)">
              {{ item.title }}
            </div>
            <div class="item-meta">{{ item.viewTime }}</div>
          </div>
          <van-icon name="cross" class="delete-icon" @click="deleteItem(item)" />
        </div>
      </div>
      <div v-else class="empty-state">
        <van-empty description="暂无浏览记录" />
      </div>
    </van-pull-refresh>

    <van-dialog
      v-model:show="showConfirm"
      title="确认清空"
      message="确定要清空所有浏览记录吗？"
      show-cancel-button
      @confirm="confirmClear"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBrowseHistory, deleteHistory, clearHistory } from '@/api'
import { showToast, showConfirmDialog } from 'vant'

const list = ref([])
const refreshing = ref(false)
const showConfirm = ref(false)

const fetchHistory = async () => {
  try {
    const res = await getBrowseHistory({ page: 1 })
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const deleteItem = async (item) => {
  try {
    await deleteHistory(item.id)
    list.value = list.value.filter(i => i.id !== item.id)
    showToast('已删除')
  } catch (e) {
    console.error(e)
  }
}

const onClear = async () => {
  showConfirmDialog({
    title: '确认清空',
    message: '确定要清空所有浏览记录吗？'
  }).then(async () => {
    try {
      await clearHistory()
      list.value = []
      showToast('已清空')
    } catch (e) {
      console.error(e)
    }
  }).catch(() => {})
}

const confirmClear = async () => {
  try {
    await clearHistory()
    list.value = []
  } catch (e) {
    console.error(e)
  }
}

const onRefresh = async () => {
  await fetchHistory()
  refreshing.value = false
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.clear-btn {
  color: var(--primary-color);
  font-size: 14px;
}

.history-list {
  padding: 12px;
}

.history-item {
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

.delete-icon {
  padding: 8px;
  color: #999;
}
</style>
