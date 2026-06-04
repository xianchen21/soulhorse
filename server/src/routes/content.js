import express from 'express'
import { getDb, saveDb } from '../db.js'

const router = express.Router()

// 首页数据
router.get('/home', (req, res) => {
  try {
    const db = getDb()

    const banners = db.banners
      .filter(b => b.status === 1)
      .sort((a, b) => a.sort - b.sort)

    const quickEntries = db.quick_entries
      .filter(e => e.status === 1)
      .sort((a, b) => a.sort - b.sort)
      .slice(0, 8)

    const contents = db.content
      .filter(c => c.status === 1)
      .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
      .slice(0, 10)
      .map(c => {
        const cat = db.categories.find(cat => cat.id === c.category_id)
        return { ...c, categoryName: cat ? cat.name : '' }
      })

    const unreadCount = db.messages.filter(m => m.is_read === 0).length

    res.json({
      data: {
        banners: banners.map(b => ({
          id: b.id,
          title: b.title,
          image: b.image,
          linkType: b.link_type,
          linkUrl: b.link_url
        })),
        quickEntries: quickEntries.map(e => ({
          id: e.id,
          name: e.name,
          icon: e.icon,
          linkUrl: e.link_url
        })),
        contents: contents.map(c => ({
          id: c.id,
          title: c.title,
          summary: c.summary,
          cover: c.cover,
          categoryName: c.categoryName,
          publishTime: c.publish_time,
          viewCount: c.view_count
        })),
        unreadCount
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 内容列表
router.get('/content', (req, res) => {
  try {
    const { categoryId, page = 1 } = req.query
    const limit = 20
    const offset = (page - 1) * limit

    const db = getDb()

    let contents = db.content
      .filter(c => c.status === 1)

    if (categoryId) {
      contents = contents.filter(c => c.category_id === categoryId)
    }

    contents = contents
      .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
      .slice(offset, offset + limit)
      .map(c => {
        const cat = db.categories.find(cat => cat.id === c.category_id)
        return { ...c, categoryName: cat ? cat.name : '' }
      })

    res.json({
      data: contents.map(c => ({
        id: c.id,
        title: c.title,
        summary: c.summary,
        cover: c.cover,
        categoryName: c.categoryName,
        publishTime: c.publish_time,
        viewCount: c.view_count
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 内容详情
router.get('/content/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()

    // 增加浏览量
    const content = db.content.find(c => c.id === id)
    if (content) {
      content.view_count = (content.view_count || 0) + 1
      saveDb()
    }

    const item = db.content.find(c => c.id === id)

    if (!item) {
      return res.status(404).json({ message: '内容不存在' })
    }

    // 相关推荐
    const related = db.content
      .filter(c => c.category_id === item.category_id && c.id !== id && c.status === 1)
      .slice(0, 5)

    const cat = db.categories.find(c => c.id === item.category_id)

    res.json({
      data: {
        content: {
          id: item.id,
          title: item.title,
          summary: item.summary,
          cover: item.cover,
          body: item.body,
          categoryName: cat ? cat.name : '',
          publishTime: item.publish_time,
          viewCount: item.view_count
        },
        related: related.map(r => ({
          id: r.id,
          title: r.title,
          cover: r.cover,
          publishTime: r.publish_time
        })),
        isCollected: false
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 搜索
router.get('/search', (req, res) => {
  try {
    const { keyword, page = 1 } = req.query
    const limit = 20
    const offset = (page - 1) * limit

    if (!keyword) {
      return res.json({ data: [] })
    }

    const db = getDb()
    const contents = db.content
      .filter(c =>
        c.status === 1 &&
        (c.title.includes(keyword) || (c.summary && c.summary.includes(keyword)))
      )
      .sort((a, b) => b.view_count - a.view_count)
      .slice(offset, offset + limit)

    res.json({
      data: contents.map(c => ({
        id: c.id,
        title: c.title,
        summary: c.summary,
        cover: c.cover,
        publishTime: c.publish_time,
        viewCount: c.view_count
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '搜索失败' })
  }
})

// 搜索建议
router.get('/search/suggestions', (req, res) => {
  try {
    const { keyword } = req.query

    if (!keyword) {
      return res.json({ data: [] })
    }

    const db = getDb()
    const contents = db.content
      .filter(c => c.status === 1 && c.title.includes(keyword))
      .slice(0, 10)

    res.json({
      data: contents.map(c => c.title)
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 分类列表
router.get('/categories', (req, res) => {
  try {
    const db = getDb()
    const categories = db.categories.sort((a, b) => a.sort - b.sort)

    res.json({
      data: categories.map(c => ({
        id: c.id,
        name: c.name,
        sort: c.sort
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 消息列表
router.get('/messages', (req, res) => {
  try {
    const db = getDb()
    const messages = db.messages.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    ).slice(0, 50)

    res.json({
      data: messages.map(m => ({
        id: m.id,
        title: m.title,
        content: m.content,
        isRead: m.is_read === 1,
        createdAt: m.created_at
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 未读消息数
router.get('/messages/unread-count', (req, res) => {
  try {
    const db = getDb()
    const count = db.messages.filter(m => m.is_read === 0).length
    res.json({ data: count })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

export default router
