import express from 'express'
import { getDb, saveDb, generateId } from '../db.js'

const router = express.Router()

// Banner管理
router.get('/banners', (req, res) => {
  try {
    const db = getDb()
    const banners = db.banners.sort((a, b) => a.sort - b.sort)
    res.json({ data: banners })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

router.post('/banner', (req, res) => {
  try {
    const { title, image, linkType, linkUrl, status, sort } = req.body
    const db = getDb()

    const banner = {
      id: generateId(),
      title,
      image,
      link_type: linkType || 'none',
      link_url: linkUrl || '',
      status: status ? 1 : 0,
      sort: sort || 0
    }

    db.banners.push(banner)
    saveDb()

    res.json({ message: '添加成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '添加失败' })
  }
})

router.put('/banner/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, image, linkType, linkUrl, status, sort } = req.body
    const db = getDb()

    const banner = db.banners.find(b => b.id === id)
    if (banner) {
      banner.title = title
      banner.image = image
      banner.link_type = linkType || 'none'
      banner.link_url = linkUrl || ''
      banner.status = status ? 1 : 0
      banner.sort = sort || 0
      saveDb()
    }

    res.json({ message: '修改成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '修改失败' })
  }
})

router.delete('/banner/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    db.banners = db.banners.filter(b => b.id !== id)
    saveDb()
    res.json({ message: '删除成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '删除失败' })
  }
})

router.patch('/banner/:id/toggle', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    const banner = db.banners.find(b => b.id === id)
    if (banner) {
      banner.status = banner.status === 1 ? 0 : 1
      saveDb()
    }
    res.json({ message: '操作成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '操作失败' })
  }
})

// 分类管理
router.get('/categories', (req, res) => {
  try {
    const db = getDb()
    const categories = db.categories.sort((a, b) => a.sort - b.sort)
    res.json({ data: categories })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

router.post('/category', (req, res) => {
  try {
    const { name, sort } = req.body
    const db = getDb()

    db.categories.push({
      id: generateId(),
      name,
      sort: sort || 0
    })
    saveDb()
    res.json({ message: '添加成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '添加失败' })
  }
})

router.put('/category/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, sort } = req.body
    const db = getDb()

    const cat = db.categories.find(c => c.id === id)
    if (cat) {
      cat.name = name
      cat.sort = sort || 0
      saveDb()
    }
    res.json({ message: '修改成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '修改失败' })
  }
})

router.delete('/category/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    db.categories = db.categories.filter(c => c.id !== id)
    saveDb()
    res.json({ message: '删除成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '删除失败' })
  }
})

router.put('/categories/sort', (req, res) => {
  try {
    const { ids } = req.body
    const db = getDb()

    ids.forEach((id, index) => {
      const cat = db.categories.find(c => c.id === id)
      if (cat) {
        cat.sort = index
      }
    })
    saveDb()
    res.json({ message: '排序成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '排序失败' })
  }
})

// 内容管理
router.get('/content', (req, res) => {
  try {
    const { page = 1, keyword } = req.query
    const limit = 20
    const offset = (page - 1) * limit

    const db = getDb()
    let contents = [...db.content]

    if (keyword) {
      contents = contents.filter(c => c.title.includes(keyword))
    }

    contents = contents
      .sort((a, b) => new Date(b.created_at || b.publish_time) - new Date(a.created_at || a.publish_time))
      .slice(offset, offset + limit)
      .map(c => {
        const cat = db.categories.find(cat => cat.id === c.category_id)
        return { ...c, categoryName: cat ? cat.name : '' }
      })

    res.json({ data: contents })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

router.post('/content', (req, res) => {
  try {
    const { title, summary, cover, body, categoryId, status } = req.body
    const db = getDb()

    const content = {
      id: generateId(),
      title,
      summary,
      cover,
      body,
      category_id: categoryId,
      status: status ? 1 : 0,
      view_count: 0,
      publish_time: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    db.content.push(content)
    saveDb()
    res.json({ message: '发布成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '发布失败' })
  }
})

router.put('/content/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, summary, cover, body, categoryId, status } = req.body
    const db = getDb()

    const content = db.content.find(c => c.id === id)
    if (content) {
      content.title = title
      content.summary = summary
      content.cover = cover
      content.body = body
      content.category_id = categoryId
      content.status = status ? 1 : 0
      saveDb()
    }

    res.json({ message: '修改成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '修改失败' })
  }
})

router.delete('/content/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    db.content = db.content.filter(c => c.id !== id)
    saveDb()
    res.json({ message: '删除成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '删除失败' })
  }
})

router.patch('/content/:id/toggle', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    const content = db.content.find(c => c.id === id)
    if (content) {
      content.status = content.status === 1 ? 0 : 1
      saveDb()
    }
    res.json({ message: '操作成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '操作失败' })
  }
})

// 数据看板
router.get('/stats', (req, res) => {
  try {
    const db = getDb()
    res.json({
      data: {
        userCount: db.users.length,
        contentCount: db.content.length,
        bannerCount: db.banners.length,
        categoryCount: db.categories.length
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

export default router
