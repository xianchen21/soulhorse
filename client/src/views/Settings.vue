<template>
  <div class="page-container">
    <van-nav-bar title="设置" left-arrow @click-left="$router.back()" />

    <van-cell-group inset>
      <van-cell title="隐私协议" is-link @click="openLink('/privacy')" />
      <van-cell title="用户协议" is-link @click="openLink('/agreement')" />
      <van-cell title="清除缓存" is-link @click="onClearCache" />
    </van-cell-group>

    <div v-if="isLoggedIn" class="logout-section">
      <van-button block type="default" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { createRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)

const openLink = (path) => {
  router.push(path)
}

const onClearCache = () => {
  localStorage.clear()
  showToast('缓存已清除')
}

const onLogout = () => {
  userStore.logout()
  showToast('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.logout-section {
  margin: 30px 16px;
}

.van-button--default {
  border-color: var(--danger-color);
  color: var(--danger-color);
}
</style>
