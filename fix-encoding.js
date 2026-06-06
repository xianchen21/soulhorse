
const fs = require('fs');
const path = require('path');

// 读取txt文件，尝试多种编码
function readTxtFile(filePath) {
  try {
    // 尝试用GBK编码读取
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return content;
  } catch (err) {
    try {
      const content = fs.readFileSync(filePath, { encoding: 'gbk' });
      return content;
    } catch (err2) {
      console.log('尝试读取文件失败:', filePath);
      return '';
    }
  }
}

// 处理阿帕卢萨马
const apalossaTxt = readTxtFile(path.join(__dirname, 'horsepic', '阿帕卢萨马.txt'));
const marwariTxt = readTxtFile(path.join(__dirname, 'horsepic', '马瓦里马.txt'));
const akhalTxt = readTxtFile(path.join(__dirname, 'horsepic', '阿哈尔捷金马.txt'));

console.log('=== 阿帕卢萨马 ===');
console.log(apalossaTxt);
console.log('\n=== 马瓦里马 ===');
console.log(marwariTxt);
console.log('\n=== 阿哈尔捷金马 ===');
console.log(akhalTxt);

// 列出图片文件
console.log('\n=== 图片文件列表 ===');
const horseDir = path.join(__dirname, 'horsepic');
const files = fs.readdirSync(horseDir);
const imageFiles = files.filter(f =&gt; f.endsWith('.jpg'));
console.log('图片文件:', imageFiles);
