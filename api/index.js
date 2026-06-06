// Vercel API Route - 处理所有请求
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, getDb } from '../server/src/db.js'
import userRoutes from '../server/src/routes/user.js'
import contentRoutes from '../server/src/routes/content.js'
import adminRoutes from '../server/src/routes/admin.js'
import trackRoutes from '../server/src/routes/track.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Vercel API Route 启动 ===')
console.log('__dirname:', __dirname)
console.log('Public path:', path.join(__dirname, '../server/public'))

const app = express()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../server/public')))

// 初始化数据库
console.log('正在初始化数据库...')
initDatabase()

// 路由
app.use('/api/user', userRoutes)
app.use('/api', contentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', trackRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  const db = getDb()
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    contentCount: db?.content?.length || 0
  })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('=== 服务器错误 ===')
  console.error(err.stack)
  res.status(500).json({ message: '服务器错误', error: err.message })
})

// 导出为 Vercel 函数
export default (req, res) => {
  return app(req, res)
}
