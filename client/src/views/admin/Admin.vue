<template>
  <div class="admin-page">
    <van-nav-bar title="运营后台" left-arrow @click-left="$router.back()" />

    <div class="admin-layout">
      <!-- 侧边栏 -->
      <div class="admin-sidebar">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item title="Banner管理" to="/admin/banner" />
          <van-sidebar-item title="分类管理" to="/admin/category" />
          <van-sidebar-item title="内容管理" to="/admin/content" />
        </van-sidebar>
      </div>

      <!-- 内容区 -->
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeKey = ref(0)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-layout {
  display: flex;
}

.admin-sidebar {
  width: 120px;
  background: #fff;
  position: fixed;
  left: 0;
  top: 46px;
  bottom: 0;
  overflow-y: auto;
}

.admin-content {
  flex: 1;
  margin-left: 120px;
  padding: 16px;
  min-height: calc(100vh - 46px);
}
</style>
