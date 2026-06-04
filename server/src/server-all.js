import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 数据存储系统
const dataPath = path.join(__dirname, '..', 'data.json');
let db = null;

function initDatabase() {
  if (fs.existsSync(dataPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
      console.log('初始化默认数据');
      db = getDefaultData();
      saveDb();
    }
  } else {
    db = getDefaultData();
    saveDb();
  }
}

function getDefaultData() {
  return {
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
        title: '阿拉伯马：沙漠之舟的优雅传奇',
        summary: '阿拉伯马是世界上最古老且最纯正的马种之一，以其独特的头部轮廓和耐力著称。',
        cover: 'https://picsum.photos/400/300?random=1',
        body: '<p>阿拉伯马是世界上最古老且最纯正的马种之一，起源于阿拉伯半岛，历史超过4000年。</p><p>它们以其独特的头部轮廓、凹形的面容和向上翘起的尾巴而闻名。阿拉伯马以其智慧、灵敏和耐力著称，是长距离骑乘的理想选择。</p>',
        category_id: 'cat-1',
        view_count: 1256,
        status: 1,
        publish_time: '2024-06-01'
      },
      {
        id: 'content-2',
        title: '马匹日常护理完全指南',
        summary: '了解如何正确地为您的马匹进行日常护理，包括梳理、洗澡和蹄部护理。',
        cover: 'https://picsum.photos/400/300?random=2',
        body: '<p>马匹的日常护理是保持其健康和幸福的关键。</p><p>定期的梳理可以促进马匹皮肤的血液循环，同时也能检查是否有寄生虫或伤口。</p>',
        category_id: 'cat-2',
        view_count: 892,
        status: 1,
        publish_time: '2024-06-02'
      },
      {
        id: 'content-3',
        title: '基础马术训练：从零开始的骑乘之旅',
        summary: '对于初学者来说，掌握正确的基础骑乘姿势和技巧至关重要。',
        cover: 'https://picsum.photos/400/300?random=3',
        body: '<p>马术训练需要耐心、尊重和对马匹的理解。</p><p>初学者应该首先学会与马匹建立信任关系，然后逐步学习基本的骑乘姿势。</p>',
        category_id: 'cat-3',
        view_count: 1567,
        status: 1,
        publish_time: '2024-06-03'
      },
      {
        id: 'content-4',
        title: '2024年国际马术赛事回顾',
        summary: '回顾今年最精彩的马术赛事，包括奥运会和世界杯等顶级比赛。',
        cover: 'https://picsum.photos/400/300?random=4',
        body: '<p>2024年是马术运动精彩纷呈的一年。</p><p>从东京奥运会到各地的世界杯分站赛，涌现出了许多令人难忘的时刻。</p>',
        category_id: 'cat-4',
        view_count: 2341,
        status: 1,
        publish_time: '2024-06-04'
      },
      {
        id: 'content-5',
        title: '传奇骑手：他们的故事与成就',
        summary: '了解马术历史上最伟大的骑手们，他们的奋斗历程和辉煌成就。',
        cover: 'https://picsum.photos/400/300?random=5',
        body: '<p>马术史上涌现出许多传奇骑手。</p><p>他们的故事激励着一代又一代的马术爱好者。</p>',
        category_id: 'cat-5',
        view_count: 1789,
        status: 1,
        publish_time: '2024-06-05'
      }
    ],
    banners: [
      { id: 'banner-1', title: '欢迎来到百骏灵集', image: 'https://picsum.photos/750/300?random=10', link_type: 'none', link_url: '', status: 1, sort: 1 },
      { id: 'banner-2', title: '春季马匹护理指南', image: 'https://picsum.photos/750/300?random=11', link_type: 'page', link_url: '/detail/content-2', status: 1, sort: 2 }
    ],
    quick_entries: [
      { id: 'entry-1', name: '马种介绍', icon: 'https://picsum.photos/80/80?random=20', link_url: '/category', sort: 1, status: 1 },
      { id: 'entry-2', name: '养护知识', icon: 'https://picsum.photos/80/80?random=21', link_url: '/category', sort: 2, status: 1 },
      { id: 'entry-3', name: '训练技巧', icon: 'https://picsum.photos/80/80?random=22', link_url: '/category', sort: 3, status: 1 },
      { id: 'entry-4', name: '赛事资讯', icon: 'https://picsum.photos/80/80?random=23', link_url: '/category', sort: 4, status: 1 }
    ],
    collections: [],
    browse_history: [],
    messages: []
  };
}

function saveDb() {
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 初始化数据库
initDatabase();

// --------------------------
// 后端API路由
// --------------------------

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 首页数据
app.get('/api/home', (req, res) => {
  const banners = db.banners.filter(b => b.status === 1).sort((a, b) => a.sort - b.sort);
  const quickEntries = db.quick_entries.filter(e => e.status === 1).sort((a, b) => a.sort - b.sort).slice(0, 8);
  const contents = db.content
    .filter(c => c.status === 1)
    .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
    .slice(0, 10)
    .map(c => {
      const cat = db.categories.find(cat => cat.id === c.category_id);
      return { ...c, categoryName: cat ? cat.name : '' };
    });
  const unreadCount = db.messages.filter(m => m.is_read === 0).length;
  
  res.json({
    data: {
      banners, quickEntries, contents, unreadCount
    }
  });
});

// 内容列表
app.get('/api/content', (req, res) => {
  const { categoryId, page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  let contents = db.content.filter(c => c.status === 1);
  
  if (categoryId) {
    contents = contents.filter(c => c.category_id === categoryId);
  }
  contents = contents
    .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
    .slice(offset, offset + limit)
    .map(c => {
      const cat = db.categories.find(cat => cat.id === c.category_id);
      return { ...c, categoryName: cat ? cat.name : '' };
    });
  
  res.json({ data: contents });
});

// 内容详情
app.get('/api/content/:id', (req, res) => {
  const { id } = req.params;
  const content = db.content.find(c => c.id === id);
  if (!content) {
    return res.status(404).json({ message: '内容不存在' });
  }
  
  // 增加浏览量
  content.view_count = (content.view_count || 0) + 1;
  saveDb();

  const related = db.content
    .filter(c => c.category_id === content.category_id && c.id !== id && c.status === 1)
    .slice(0, 5);
  const cat = db.categories.find(c => c.id === content.category_id);
  
  res.json({
    data: {
      content: { ...content, categoryName: cat ? cat.name : '' },
      related,
      isCollected: false
    }
  });
});

// 搜索
app.get('/api/search', (req, res) => {
  const { keyword, page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  if (!keyword) return res.json({ data: [] });
  const contents = db.content
    .filter(c =>
      c.status === 1 && (c.title.includes(keyword) || (c.summary && c.summary.includes(keyword)))
    )
    .sort((a, b) => b.view_count - a.view_count)
    .slice(offset, offset + limit);
  res.json({ data: contents });
});

// 搜索建议
app.get('/api/search/suggestions', (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.json({ data: [] });
  const contents = db.content
    .filter(c => c.status === 1 && c.title.includes(keyword))
    .slice(0, 10);
  res.json({ data: contents.map(c => c.title) });
});

// 分类列表
app.get('/api/categories', (req, res) => {
  const categories = db.categories.sort((a, b) => a.sort - b.sort);
  res.json({ data: categories });
});

// 用户登录
app.post('/api/user/login', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: '请输入正确的手机号' });
  }
  let user = db.users.find(u => u.phone === phone);
  if (!user) {
    const uid = 'U' + Date.now().toString().slice(-8);
    user = { id: generateId(), phone, nickname: `用户${uid}`, uid, created_at: new Date().toISOString() };
    db.users.push(user);
    saveDb();
  }
  res.json({
    message: '登录成功', data: { token: 'mock-token-' + user.id, user }
  });
});

// 获取用户信息
app.get('/api/user/info', (req, res) => {
  res.json({ data: { id: 'demo', phone: '13800138000', nickname: '访客用户', uid: 'U000001' } });
});

// --------------------------
// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------
// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 百骏灵集 - 马匹百科已启动！');
  console.log(`   访问地址: http://localhost:${PORT}`);
  console.log('');
  console.log('   功能包括:');
  console.log('   ✓ 首页推荐');
  console.log('   ✓ 内容搜索');
  console.log('   ✓ 分类浏览');
  console.log('   ✓ 详情展示');
  console.log('   ✓ 个人中心');
  console.log('');
  console.log('   无需安装前端依赖，直接访问即可！');
});
