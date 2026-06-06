const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');

// 1. 检查并安装依赖
console.log('检查前端依赖...');
if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
  console.log('正在安装前端依赖...');
  try {
    execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
    console.log('前端依赖安装完成！');
  } catch (e) {
    console.error('安装依赖失败:', e.message);
    process.exit(1);
  }
} else {
  console.log('前端依赖已就绪');
}

// 2. 启动Vite开发服务器
console.log('\n启动前端开发服务器...');
const vite = spawn('node', [
  path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js')
], {
  cwd: clientDir,
  stdio: 'inherit'
});

vite.on('error', (err) => {
  console.error('启动失败:', err);
});
