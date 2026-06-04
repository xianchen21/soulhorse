import express from 'express'
import jwt from 'jsonwebtoken'
import { getDb, saveDb, generateId } from '../db.js'

const router = express.Router()
const JWT_SECRET = 'soulhorse-wiki-secret-key'

// 登录
router.post('/login', (req, res) => {
  try {
    const { phone, code } = req.body

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: '请输入正确的手机号' })
    }

    // 验证码校验（V1.0简化版：任意6位数字）
    if (!code || code.length !== 6) {
      return res.status(400).json({ message: '请输入6位验证码' })
    }

    const db = getDb()

    // 查询或创建用户
    let user = db.users.find(u => u.phone === phone)

    if (!user) {
      const uid = 'U' + Date.now().toString().slice(-8)
      user = {
        id: generateId(),
        phone,
        nickname: `用户${uid}`,
        uid,
        created_at: new Date().toISOString()
      }
      db.users.push(user)
      saveDb()
    }

    // 生成token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })

    res.json({
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          uid: user.uid
        }
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '登录失败' })
  }
})

// 获取用户信息
router.get('/info', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '未登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)

    const db = getDb()
    const user = db.users.find(u => u.id === decoded.userId)

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json({
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        uid: user.uid
      }
    })
  } catch (e) {
    console.error(e)
    res.status(401).json({ message: '登录已过期' })
  }
})

// 获取收藏列表
router.get('/collections', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '未登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    const { page = 1 } = req.query
    const limit = 20
    const offset = (page - 1) * limit

    const db = getDb()
    const userCollections = db.collections
      .filter(c => c.user_id === decoded.userId)
      .map(c => {
        const content = db.content.find(ct => ct.id === c.content_id)
        return content ? { ...content, collectTime: c.collect_time } : null
      })
      .filter(Boolean)
      .slice(offset, offset + limit)

    res.json({
      data: userCollections.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        cover: item.cover,
        collectTime: item.collectTime
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 收藏操作
router.post('/collect', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '请先登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    const { contentId, action } = req.body

    const db = getDb()

    if (action === 'add') {
      const existing = db.collections.find(
        c => c.user_id === decoded.userId && c.content_id === contentId
      )
      if (!existing) {
        db.collections.push({
          id: generateId(),
          user_id: decoded.userId,
          content_id: contentId,
          collect_time: new Date().toISOString()
        })
        saveDb()
      }
    } else if (action === 'remove') {
      db.collections = db.collections.filter(
        c => !(c.user_id === decoded.userId && c.content_id === contentId)
      )
      saveDb()
    }

    res.json({ message: '操作成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '操作失败' })
  }
})

// 获取浏览历史
router.get('/history', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '未登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    const { page = 1 } = req.query
    const limit = 20
    const offset = (page - 1) * limit

    const db = getDb()
    const history = db.browse_history
      .filter(h => h.user_id === decoded.userId)
      .map(h => {
        const content = db.content.find(ct => ct.id === h.content_id)
        return content ? { ...content, viewTime: h.view_time } : null
      })
      .filter(Boolean)
      .slice(offset, offset + limit)

    res.json({
      data: history.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        cover: item.cover,
        viewTime: item.viewTime
      }))
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '获取失败' })
  }
})

// 删除单条浏览历史
router.delete('/history/:id', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '请先登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    const { id } = req.params

    const db = getDb()
    db.browse_history = db.browse_history.filter(
      h => !(h.user_id === decoded.userId && h.content_id === id)
    )
    saveDb()

    res.json({ message: '删除成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '删除失败' })
  }
})

// 清空浏览历史
router.delete('/history', (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({ message: '请先登录' })
    }

    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)

    const db = getDb()
    db.browse_history = db.browse_history.filter(h => h.user_id !== decoded.userId)
    saveDb()

    res.json({ message: '清空成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '清空失败' })
  }
})

export default router
