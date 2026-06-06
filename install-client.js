const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('正在安装前端依赖...');
try {
  const clientDir = path.join(__dirname, 'client');
  if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
    execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
    console.log('前端依赖安装完成！');
  } else {
    console.log('前端依赖已存在');
  }
} catch (e) {
  console.error('安装失败:', e.message);
}
