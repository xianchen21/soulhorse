<template>
  <div class="content-manage">
    <div class="manage-header">
      <h3>内容列表</h3>
      <van-button type="primary" size="small" @click="showAdd = true">发布内容</van-button>
    </div>

    <van-table :data="list" border>
      <van-table-column prop="id" label="ID" width="60" />
      <van-table-column label="封面" width="100">
        <template #default="{ row }">
          <img :src="row.cover" class="preview-cover" />
        </template>
      </van-table-column>
      <van-table-column prop="title" label="标题" />
      <van-table-column prop="categoryName" label="分类" width="100" />
      <van-table-column label="状态" width="80">
        <template #default="{ row }">
          <van-tag :type="row.status === 1 ? 'success' : 'default'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </van-tag>
        </template>
      </van-table-column>
      <van-table-column label="操作" width="180">
        <template #default="{ row }">
          <van-button size="small" type="primary" @click="onEdit(row)">编辑</van-button>
          <van-button size="small" @click="onToggle(row)">
            {{ row.status === 1 ? '下架' : '上架' }}
          </van-button>
          <van-button size="small" type="danger" @click="onDelete(row)">删除</van-button>
        </template>
      </van-table-column>
    </van-table>

    <!-- 新增/编辑弹窗 -->
    <van-popup v-model:show="showAdd" position="bottom" round style="height: 90%">
      <div class="form-popup">
        <div class="popup-title">{{ editingId ? '编辑内容' : '发布内容' }}</div>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field v-model="form.title" label="标题" placeholder="请输入标题" required />
            <van-field v-model="form.summary" label="简介" placeholder="请输入简介" />
            <van-field v-model="form.cover" label="封面图URL" placeholder="请输入封面图地址" required />
            <van-field
              v-model="form.categoryId"
              label="分类"
              placeholder="请选择分类"
              readonly
              @click="showCategoryPicker = true"
            />
            <van-field
              v-model="form.body"
              label="正文"
              type="textarea"
              rows="4"
              placeholder="请输入正文内容，支持HTML"
            />
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

    <van-popup v-model:show="showCategoryPicker" position="bottom">
      <van-picker
        :columns="categoryColumns"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAdminContentList, createContent, updateContent, deleteContent, toggleContentStatus, getCategoryList } from '@/api'
import { showToast, showConfirmDialog } from 'vant'

const list = ref([])
const categories = ref([])
const showAdd = ref(false)
const showCategoryPicker = ref(false)
const editingId = ref(null)
const form = ref({
  title: '',
  summary: '',
  cover: '',
  categoryId: '',
  body: '',
  status: true
})

const categoryColumns = computed(() =>
  categories.value.map(c => ({ text: c.name, value: c.id }))
)

const fetchList = async () => {
  try {
    const res = await getAdminContentList({ page: 1 })
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data || []
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
      await updateContent(editingId.value, form.value)
      showToast('修改成功')
    } else {
      await createContent(form.value)
      showToast('发布成功')
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
    await showConfirmDialog({ title: '确认删除', message: '确定删除此内容？' })
    await deleteContent(row.id)
    showToast('删除成功')
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

const onToggle = async (row) => {
  try {
    await toggleContentStatus(row.id)
    showToast('操作成功')
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

const onCategoryConfirm = ({ selectedOptions }) => {
  form.value.categoryId = selectedOptions[0].value
  showCategoryPicker.value = false
}

onMounted(() => {
  fetchList()
  fetchCategories()
})
</script>

<style scoped>
.content-manage {
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

.preview-cover {
  width: 80px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
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
