import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase } from './db.js'
import userRoutes from './routes/user.js'
import contentRoutes from './routes/content.js'
import adminRoutes from './routes/admin.js'
import trackRoutes from './routes/track.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Vercel 环境下的路径配置
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production'
const staticPath = isVercel 
  ? path.join(__dirname, '../../public')  // Vercel 环境
  : path.join(__dirname, '../public')     // 本地开发环境

console.log('Running in:', isVercel ? 'Vercel' : 'Local')
console.log('Static path:', staticPath)
console.log('__dirname:', __dirname)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static(staticPath))

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
