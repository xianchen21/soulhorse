<template>
  <div class="banner-manage">
    <div class="manage-header">
      <h3>Banner列表</h3>
      <van-button type="primary" size="small" @click="showAdd = true">新增Banner</van-button>
    </div>

    <van-table :data="list" border class="data-table">
      <van-table-column prop="id" label="ID" width="60" />
      <van-table-column label="图片" width="120">
        <template #default="{ row }">
          <img :src="row.image" class="preview-img" />
        </template>
      </van-table-column>
      <van-table-column prop="title" label="标题" />
      <van-table-column label="状态" width="80">
        <template #default="{ row }">
          <van-tag :type="row.status === 1 ? 'success' : 'default'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </van-tag>
        </template>
      </van-table-column>
      <van-table-column label="操作" width="150">
        <template #default="{ row }">
          <van-button size="small" type="primary" @click="onEdit(row)">编辑</van-button>
          <van-button size="small" type="danger" @click="onDelete(row)">删除</van-button>
        </template>
      </van-table-column>
    </van-table>

    <!-- 新增/编辑弹窗 -->
    <van-popup v-model:show="showAdd" position="bottom" round style="height: 80%">
      <div class="form-popup">
        <div class="popup-title">{{ editingId ? '编辑Banner' : '新增Banner' }}</div>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field v-model="form.title" label="标题" placeholder="请输入标题" required />
            <van-field v-model="form.image" label="图片URL" placeholder="请输入图片地址" required />
            <van-field
              v-model="form.linkType"
              label="跳转类型"
              placeholder="h5/page/none"
            />
            <van-field v-model="form.linkUrl" label="跳转地址" placeholder="请输入跳转链接" />
            <van-field name="status" label="状态">
              <template #input>
                <van-switch v-model="form.status" size="20" />
              </template>
            </van-field>
          </van-cell-group>
          <div class="form-actions">
            <van-button @click="showAdd = false">取消</van-button>
            <van-button type="primary" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBannerList, createBanner, updateBanner, deleteBanner } from '@/api'
import { showToast, showConfirmDialog } from 'vant'

const list = ref([])
const showAdd = ref(false)
const editingId = ref(null)
const form = ref({
  title: '',
  image: '',
  linkType: 'none',
  linkUrl: '',
  status: true
})

const fetchList = async () => {
  try {
    const res = await getBannerList()
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const onEdit = (row) => {
  editingId.value = row.id
  form.value = { ...row }
  showAdd.value = true
}

const onSubmit = async () => {
  try {
    if (editingId.value) {
      await updateBanner(editingId.value, form.value)
      showToast('修改成功')
    } else {
      await createBanner(form.value)
      showToast('添加成功')
    }
    showAdd.value = false
    editingId.value = null
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

const onDelete = async (row) => {
  try {
    await showConfirmDialog({ title: '确认删除', message: '确定删除此Banner？' })
    await deleteBanner(row.id)
    showToast('删除成功')
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.banner-manage {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.manage-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.preview-img {
  width: 100px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.data-table {
  margin-top: 12px;
}

.form-popup {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
