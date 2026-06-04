import express from 'express'

const router = express.Router()

// 埋点上报
router.post('/track', (req, res) => {
  try {
    const { event, params } = req.body

    // V1.0简化版：仅记录日志
    console.log('[Track]', event, params)

    res.json({ message: 'ok' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '上报失败' })
  }
})

export default router
