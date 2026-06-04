<template>
  <div class="page-container profile-page">
    <van-nav-bar title="我的" />

    <!-- 用户信息区域 -->
    <div class="profile-header">
      <template v-if="isLoggedIn">
        <div class="user-info">
          <img :src="userInfo?.avatar || '/default-avatar.png'" class="avatar" />
          <div class="user-detail">
            <div class="nickname">{{ userInfo?.nickname || '用户' }}</div>
            <div class="uid">UID: {{ userInfo?.uid }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="not-login">
          <img src="/default-avatar.png" class="avatar" />
          <div class="login-btn" @click="showLogin = true">点击登录</div>
        </div>
      </template>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell title="我的收藏" is-link to="/my-collections" icon="star-o" />
        <van-cell title="浏览历史" is-link to="/browse-history" icon="clock-o" />
        <van-cell title="消息中心" is-link to="/messages" icon="bell-o" :badge="unreadCount || null" />
        <van-cell title="设置" is-link to="/settings" icon="setting-o" />
      </van-cell-group>
    </div>

    <!-- 登录弹窗 -->
    <van-popup v-model:show="showLogin" position="bottom" round>
      <div class="login-popup">
        <div class="popup-title">手机号登录</div>
        <van-form @submit="onLogin">
          <van-cell-group inset>
            <van-field
              v-model="phone"
              type="tel"
              maxlength="11"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
            <van-field
              v-model="code"
              type="digit"
              maxlength="6"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  :disabled="countdown > 0"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
          <div class="login-submit">
            <van-button round block type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 底部导航 -->
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { login } from '@/api'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { showToast, showSuccessToast } from 'vant'

const userStore = useUserStore()
const appStore = useAppStore()

const activeTab = ref(2)
const showLogin = ref(false)
const phone = ref('')
const code = ref('')
const countdown = ref(0)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const unreadCount = computed(() => appStore.unreadCount)

let timer = null

const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入正确的手机号')
    return
  }
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  showToast('验证码已发送')
}

const onLogin = async () => {
  try {
    const res = await login({ phone: phone.value, code: code.value })
    userStore.setToken(res.data.token)
    await userStore.fetchUserInfo()
    showLogin.value = false
    showSuccessToast('登录成功')
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  if (userStore.token) {
    userStore.fetchUserInfo()
  }
})
</script>

<style scoped>
.profile-page {
  padding-bottom: 50px;
}

.profile-header {
  background: linear-gradient(135deg, var(--primary-color), #3b82f6);
  padding: 30px 20px;
  color: #fff;
}

.user-info,
.not-login {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.3);
}

.nickname {
  font-size: 18px;
  font-weight: 600;
}

.uid {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
}

.login-btn {
  font-size: 16px;
  padding: 8px 24px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
}

.menu-section {
  margin-top: 12px;
}

.login-popup {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.login-submit {
  margin: 20px 16px 0;
}
</style>
