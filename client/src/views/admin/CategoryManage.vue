<template>
  <div class="category-manage">
    <div class="manage-header">
      <h3>分类列表</h3>
      <van-button type="primary" size="small" @click="onAdd">新增分类</van-button>
    </div>

    <van-table :data="list" border>
      <van-table-column prop="id" label="ID" width="60" />
      <van-table-column prop="name" label="分类名称" />
      <van-table-column prop="sort" label="排序" width="100" />
      <van-table-column label="操作" width="200">
        <template #default="{ row, $index }">
          <van-button size="small" type="primary" @click="onEdit(row)">编辑</van-button>
          <van-button size="small" @click="moveUp($index)" :disabled="$index === 0">上移</van-button>
          <van-button size="small" @click="moveDown($index)" :disabled="$index === list.length - 1">下移</van-button>
          <van-button size="small" type="danger" @click="onDelete(row)">删除</van-button>
        </template>
      </van-table-column>
    </van-table>

    <van-dialog v-model:show="showDialog" :title="editingId ? '编辑分类' : '新增分类'" show-cancel-button @confirm="onSubmit">
      <van-form>
        <van-cell-group inset>
          <van-field v-model="form.name" label="分类名称" placeholder="请输入分类名称" required />
          <van-field v-model.number="form.sort" label="排序" type="number" placeholder="数字越小越靠前" />
        </van-cell-group>
      </van-form>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategoryList, createCategory, updateCategory, deleteCategory, sortCategories } from '@/api'
import { showToast, showConfirmDialog } from 'vant'

const list = ref([])
const showDialog = ref(false)
const editingId = ref(null)
const form = ref({ name: '', sort: 0 })

const fetchList = async () => {
  try {
    const res = await getCategoryList()
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

const onAdd = () => {
  editingId.value = null
  form.value = { name: '', sort: 0 }
  showDialog.value = true
}

const onEdit = (row) => {
  editingId.value = row.id
  form.value = { ...row }
  showDialog.value = true
}

const onSubmit = async () => {
  try {
    if (editingId.value) {
      await updateCategory(editingId.value, form.value)
      showToast('修改成功')
    } else {
      await createCategory(form.value)
      showToast('添加成功')
    }
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

const onDelete = async (row) => {
  try {
    await showConfirmDialog({ title: '确认删除', message: '确定删除此分类？' })
    await deleteCategory(row.id)
    showToast('删除成功')
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

const moveUp = async (index) => {
  const newList = [...list.value]
  ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
  list.value = newList
  await sortCategories(newList.map(item => item.id))
  showToast('已上移')
}

const moveDown = async (index) => {
  const newList = [...list.value]
  ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
  list.value = newList
  await sortCategories(newList.map(item => item.id))
  showToast('已下移')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.category-manage {
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
</style>
