const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('尝试安装前端依赖...');
const clientPath = path.join(__dirname, 'client');

exec('npm install', { cwd: clientPath }, (err, stdout, stderr) => {
  if (err) {
    console.error('依赖安装失败:', err);
    console.log('\n尝试跳过安装，启动开发服务器...');
  } else {
    console.log('依赖安装成功！');
  }

  console.log('启动前端开发服务器...');
  const vitePath = path.join(clientPath, 'node_modules', 'vite', 'bin', 'vite.js');
  
  if (fs.existsSync(vitePath)) {
    const vite = exec('node "' + vitePath + '"', { cwd: clientPath });
    vite.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    vite.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  } else {
    console.log('\n需要手动安装依赖：');
    console.log('cd client && npm install && npm run dev');
  }
});
