const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, 'client');
const npmPath = path.join(__dirname, 'server', 'node_modules', '.bin', 'npm.cmd');
const npmExists = fs.existsSync(npmPath);

console.log('=== 百骏灵集 - 启动程序 ===');

function installAndRun() {
  console.log('1. 检查前端依赖...');
  const nodeModulesExists = fs.existsSync(path.join(clientPath, 'node_modules'));
  if (nodeModulesExists) {
    console.log('   依赖已存在，跳过安装');
    startVite();
  } else {
    console.log('2. 正在安装前端依赖...');
    installDependencies();
  }
}

function installDependencies() {
  const install = spawn('npm', ['install'], { cwd: clientPath, stdio: 'inherit', shell: true });
  install.on('error', (err) => {
    console.error('安装依赖出错:', err);
    tryAlternative();
  });
  install.on('exit', (code) => {
    if (code === 0) {
      console.log('依赖安装完成！');
      startVite();
    } else {
      console.error('依赖安装失败，尝试备用方案...');
      tryAlternative();
    }
  });
}

function tryAlternative() {
  console.log('尝试使用系统npm...');
  const install = exec('npm install', { cwd: clientPath, stdio: 'inherit', shell: true });
  install.on('exit', (code) => {
    if (code === 0) startVite();
  });
}

function startVite() {
  console.log('\n3. 启动Vite开发服务器...');
  const vite = spawn('npm', ['run', 'dev'], { cwd: clientPath, stdio: 'inherit', shell: true });
  vite.on('error', (err) => {
    console.error('启动失败:', err);
  });
}

installAndRun();
