import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Vercel 环境下的路径配置 - 支持从 server/src/ 或 api/ 调用
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production'
const DB_PATH = join(__dirname, '../data.json')

console.log('=== DB 初始化 ===')
console.log('isVercel:', isVercel)
console.log('__dirname:', __dirname)
console.log('DB_PATH:', DB_PATH)
console.log('File exists:', existsSync(DB_PATH))

const defaultData = {
  users: [],
  categories: [
    { id: 'cat-1', name: '马种介绍', sort: 1 },
    { id: 'cat-2', name: '养护知识', sort: 2 },
    { id: 'cat-3', name: '训练技巧', sort: 3 },
    { id: 'cat-4', name: '赛事资讯', sort: 4 },
    { id: 'cat-5', name: '骑手故事', sort: 5 }
  ],
  content: [
    {
      id: 'content-1',
      title: '阿帕卢萨马：传奇的花斑马种',
      summary: '阿帕卢萨马是北美印第安人培育的马种，以独特的花斑闻名于世。',
      cover: '/images/阿帕卢萨马/apalossa_1.jpg',
      images: ['/images/阿帕卢萨马/apalossa_1.jpg', '/images/阿帕卢萨马/apalossa_2.jpg', '/images/阿帕卢萨马/apalossa_3.jpg', '/images/阿帕卢萨马/apalossa_4.jpg'],
      body: '<h2>一百种有趣的灵魂——其一：阿帕卢萨马</h2><p><strong>来自北美的「花斑精灵」</strong></p><p><strong>- 中文名</strong>：阿帕卢萨马</p><p><strong>- 英文名</strong>：Appaloosa</p><p><strong>- 产地</strong>：美国爱达荷州、华盛顿州、俄勒冈州</p><p><strong>- 肩高</strong>：145-160cm</p><p><strong>- 体重</strong>：450-500kg</p><h3>🐴 血统来源</h3><p>血统可追溯至16世纪西班牙人带到美洲的马，由北美原住民内兹珀斯人（Nez Perce）经几百年选育而成，因帕卢斯河（Palouse River）而得名Appaloosa。1877年战争后几近灭绝，1938年成立品种协会，现已恢复至全球约70万匹。</p><h3>✨ 标志性特征（记住这几点就不会认错）</h3><p>1. 独特的皮毛图案：雪花纹（Snowflake）、豹纹（Leopard）、毛毯纹（Blanket）等，每一匹的斑点图案都是独一无二的</p><p>2. 白色巩膜：环绕在虹膜周围的白色+深色巩膜</p><p>3. 条纹状蹄壁：即便纯色个体也有竖条纹蹄壁，辨识度超高</p><p>4. 斑驳皮肤：口鼻、眼睛周围、生殖器等部位有斑点皮肤，一眼可辨</p><h3>🏇 性格与能力</h3><p><strong>- 性格</strong>：聪明、温顺、学习快、稳定，同时也能兼具速度</p><p><strong>- 运动能力</strong>：耐力强、敏捷度高、多才多艺，适合全项目选种</p><p><strong>- 擅长</strong>：西部马术、赛马、休闲骑乘，越爱工作越能展现魅力</p><h3>💡 冷知识</h3><p><strong>- 马背上的LP基因</strong>：携带这个基因才会有斑点，LP纯合子会有夜盲症风险</p><p><strong>- 斑点会随年龄变化</strong>：小时候的斑点图案，长大后也可能完全不一样</p>',
      category_id: 'cat-1',
      view_count: 1263,
      status: 1,
      publish_time: '2024-01-01'
    },
    {
      id: 'content-2',
      title: '马瓦里马：会跳舞的弯耳朵马',
      summary: '来自印度的珍稀马种，耳朵能旋转180度，以优雅著称。',
      cover: '/images/马瓦里马/marwari_1.jpg',
      images: ['/images/马瓦里马/marwari_1.jpg', '/images/马瓦里马/marwari_2.jpg', '/images/马瓦里马/marwari_3.jpg', '/images/马瓦里马/marwari_4.jpg', '/images/马瓦里马/marwari_5.jpg', '/images/马瓦里马/marwari_6.jpg', '/images/马瓦里马/marwari_7.jpg', '/images/马瓦里马/marwari_8.jpg', '/images/马瓦里马/marwari_9.jpg', '/images/马瓦里马/marwari_10.jpg', '/images/马瓦里马/marwari_11.jpg', '/images/马瓦里马/marwari_12.jpg'],
      body: '<h2>一百种有趣的灵魂——其二：马瓦里马</h2><p>印度有这么一种马，不仅耳朵能弯成爱心状，还是世界上最容易认出来的马种之一。</p><h3>🐴 起源</h3><p>来自印度西北部拉贾斯坦邦的马尔瓦（Marwar）地区，因此得名 Marwari horse</p><p>约12世纪由当地土王与阿富汗骑兵带来的中亚血统混种而成，能在沙漠与山地生存并适应拉贾斯坦的极端气候。</p><p>历史上是皇家战马，能在战场上灵活转弯、掉头，战斗力强。</p><p>20世纪差点灭绝，如今被印度政府列为国宝级马种之一。</p><h3>✨ 特色</h3><p><strong>- 耳朵</strong>：向内弯成爱心状，能旋转180度，随时切换可爱与警戒状态</p><p><strong>- 体型</strong>：中等身材，肩高约150-165cm，体重约500-540kg，步态优雅，天生会跳舞，耐力强</p><p><strong>- 毛色</strong>：多样，枣红、黑色、栗色、灰色等为主，但纯白色最珍贵</p><p><strong>- 步态</strong>：独特的四拍摇摆步（revaal/dhau），骑起来特别稳</p><p>现在马瓦里马在拉贾斯坦邦的婚礼和仪式上仍然是「尊贵嘉宾」，用来迎娶新娘，希望能给新人带来好运，象征着对婚礼和新人的祝福。</p><p>话说这种能把耳朵弯成爱心的「会跳舞的马」，怎么能让人不心动呢？你想不想亲眼见见拉贾斯坦邦的土王？</p>',
      category_id: 'cat-1',
      view_count: 1898,
      status: 1,
      publish_time: '2024-01-02'
    },
    {
      id: 'content-3',
      title: '阿哈尔捷金马：丝绸之路上的汗血宝马',
      summary: '来自土库曼斯坦的国宝，世界上最稀有的马种之一，以其独特的金属光泽皮毛闻名。',
      cover: '/images/阿哈尔捷金马/akhal_1.jpg',
      images: ['/images/阿哈尔捷金马/akhal_1.jpg', '/images/阿哈尔捷金马/akhal_2.jpg', '/images/阿哈尔捷金马/akhal_3.jpg', '/images/阿哈尔捷金马/akhal_4.jpg', '/images/阿哈尔捷金马/akhal_5.jpg', '/images/阿哈尔捷金马/akhal_6.jpg', '/images/阿哈尔捷金马/akhal_7.jpg', '/images/阿哈尔捷金马/akhal_8.jpg', '/images/阿哈尔捷金马/akhal_9.jpg', '/images/阿哈尔捷金马/akhal_10.jpg', '/images/阿哈尔捷金马/akhal_11.jpg', '/images/阿哈尔捷金马/akhal_12.jpg', '/images/阿哈尔捷金马/akhal_13.jpg', '/images/阿哈尔捷金马/akhal_14.jpg'],
      body: '<h2>一百种有趣的灵魂——其三：阿哈尔捷金马</h2><p>阿哈尔捷金马（Akhal-Teke）来自土库曼斯坦，是世界上最古老、最稀有的纯种马之一，它们的皮毛会在阳光下反射出独特的金属光泽，因此也被称为「来自天堂的马」。传说中汗血宝马就是它们的后代，因为皮肤薄，运动时可以看到血管，出汗时皮肤会充血泛红，看起来像在流血，自然也有不同的「汗血」说法，但这种特性让它们在历史上成为了珍贵的战马。如今土库曼斯坦将它们印在国徽和货币上，是国宝级的存在。</p><p>阿哈尔捷金马在丝绸之路的历史上也扮演了重要角色，它们能在沙漠中长途跋涉，据说有一匹马曾在3000年前创下了1935年从阿什哈巴德跑到莫斯科的纪录，用时84天，跑完4000多公里的沙漠路，因此也被称为「沙漠中的超级马拉松选手」。</p><h3>✨ 特征</h3><p>体型纤细优雅，脖子修长，头型精致，身体线条流畅纤细，皮肤薄能看到血管</p><h3>✨ 标志性特征</h3><p>皮毛有金属光泽，皮肤薄，出汗时会呈现出独特的「汗血」效果</p><h3>🖼️ 图片说明</h3><p>图1-9是土库曼斯坦原版阿哈尔捷金，图10是中国繁育的阿哈尔捷金，图11-14是与其他马种的混血</p>',
      category_id: 'cat-1',
      view_count: 2579,
      status: 1,
      publish_time: '2024-01-03'
    },
    {
      id: 'content-4',
      title: '马匹日常护理完全指南',
      summary: '了解如何正确地为您的马匹进行日常护理，包括梳理、洗澡和蹄部护理。',
      cover: 'https://picsum.photos/400/300?random=2',
      images: [],
      body: '<p>马匹的日常护理是保持其健康和幸福的关键...</p><p>定期的梳理可以促进马匹皮肤的血液循环，同时也能检查是否有寄生虫或伤口。</p>',
      category_id: 'cat-2',
      view_count: 892,
      status: 1,
      publish_time: '2024-01-04'
    },
    {
      id: 'content-5',
      title: '基础马术训练：从零开始的骑乘之旅',
      summary: '对于初学者来说，掌握正确的基础骑乘姿势和技巧至关重要。',
      cover: 'https://picsum.photos/400/300?random=3',
      images: [],
      body: '<p>马术训练需要耐心、尊重和对马匹的理解...</p><p>初学者应该首先学会与马匹建立信任关系，然后逐步学习基本的骑乘姿势。</p>',
      category_id: 'cat-3',
      view_count: 1567,
      status: 1,
      publish_time: '2024-01-05'
    }
  ],
  banners: [
    { id: 'banner-1', title: '阿帕卢萨马', image: '/images/阿帕卢萨马/apalossa_1.jpg', link_type: 'page', link_url: '/detail/content-1', status: 1, sort: 1 },
    { id: 'banner-2', title: '马瓦里马', image: '/images/马瓦里马/marwari_1.jpg', link_type: 'page', link_url: '/detail/content-2', status: 1, sort: 2 },
    { id: 'banner-3', title: '阿哈尔捷金马', image: '/images/阿哈尔捷金马/akhal_1.jpg', link_type: 'page', link_url: '/detail/content-3', status: 1, sort: 3 }
  ],
  quick_entries: [
    { id: 'entry-1', name: '马种介绍', icon: '/images/阿帕卢萨马/apalossa_1.jpg', link_url: '/category', sort: 1, status: 1 },
    { id: 'entry-2', name: '养护知识', icon: 'https://picsum.photos/80/80?random=21', link_url: '/category', sort: 2, status: 1 },
    { id: 'entry-3', name: '训练技巧', icon: 'https://picsum.photos/80/80?random=22', link_url: '/category', sort: 3, status: 1 },
    { id: 'entry-4', name: '赛事资讯', icon: 'https://picsum.photos/80/80?random=23', link_url: '/category', sort: 4, status: 1 }
  ],
  collections: [],
  browse_history: [],
  messages: []
}

let db = null

export function initDatabase() {
  console.log('=== 正在初始化数据库 ===')
  console.log('DB_PATH:', DB_PATH)
  console.log('File exists:', existsSync(DB_PATH))
  
  if (existsSync(DB_PATH)) {
    try {
      const content = readFileSync(DB_PATH, 'utf-8')
      db = JSON.parse(content)
      console.log('✅ 从文件加载数据库成功')
      console.log('Content count:', db?.content?.length)
    } catch (e) {
      console.error('❌ 从文件加载数据库失败，使用默认数据:', e)
      db = { ...defaultData }
    }
  } else {
    console.log('⚠️ 数据库文件不存在，使用默认数据')
    db = { ...defaultData }
  }
}

export function saveDb() {
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production'
  if (isVercel) {
    console.log('Vercel 只读文件系统，跳过保存')
    return
  }
  try {
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
  } catch (e) {
    console.error('保存数据库失败:', e)
  }
}

export function getDb() {
  if (!db) {
    initDatabase()
  }
  return db
}

// 辅助函数
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export default {
  initDatabase,
  saveDb,
  getDb,
  generateId
}
