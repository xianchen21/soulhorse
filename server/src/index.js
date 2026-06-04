import express from 'express'
import cors from 'cors'
import { initDatabase } from './db.js'
import userRoutes from './routes/user.js'
import contentRoutes from './routes/content.js'
import adminRoutes from './routes/admin.js'
import trackRoutes from './routes/track.js'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 初始化数据库
initDatabase()

// 路由
app.use('/api/user', userRoutes)
app.use('/api', contentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', trackRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: '服务器错误' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
