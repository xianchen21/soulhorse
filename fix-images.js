
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 简化文件名，避免特殊字符问题
function simplifyFilename(filename) {
  return filename
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_.-]/g, '_') // 替换特殊字符
    .replace(/_+/g, '_') // 合并连续下划线
    .replace(/_$/, ''); // 去掉结尾下划线
}

// 读取当前data.json
const dataPath = path.join(__dirname, 'server', 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

const horsepicDir = path.join(__dirname, 'horsepic');
const imagesDir = path.join(__dirname, 'server', 'public', 'images');

// 阿帕卢萨马
const apalossaFiles = fs.readdirSync(horsepicDir).filter(f =&gt; f.includes('阿帕卢萨') &amp;&amp; f.endsWith('.jpg'));
const newApalossaFiles = [];
for (let i = 0; i &lt; apalossaFiles.length; i++) {
  const oldPath = path.join(horsepicDir, apalossaFiles[i]);
  const ext = path.extname(apalossaFiles[i]);
  const newFilename = `apalossa_${i + 1}${ext}`;
  const newPath = path.join(imagesDir, '阿帕卢萨马', newFilename);
  fs.copyFileSync(oldPath, newPath);
  newApalossaFiles.push(newFilename);
}

// 马瓦里马
const marwariFiles = fs.readdirSync(horsepicDir).filter(f =&gt; f.includes('马瓦里') &amp;&amp; f.endsWith('.jpg'));
const newMarwariFiles = [];
for (let i = 0; i &lt; marwariFiles.length; i++) {
  const oldPath = path.join(horsepicDir, marwariFiles[i]);
  const ext = path.extname(marwariFiles[i]);
  const newFilename = `marwari_${i + 1}${ext}`;
  const newPath = path.join(imagesDir, '马瓦里马', newFilename);
  fs.copyFileSync(oldPath, newPath);
  newMarwariFiles.push(newFilename);
}

// 阿哈尔捷金马
const akhalFiles = fs.readdirSync(horsepicDir).filter(f =&gt; f.includes('阿哈尔捷金') &amp;&amp; f.endsWith('.jpg'));
const newAkhalFiles = [];
for (let i = 0; i &lt; akhalFiles.length; i++) {
  const oldPath = path.join(horsepicDir, akhalFiles[i]);
  const ext = path.extname(akhalFiles[i]);
  const newFilename = `akhal_${i + 1}${ext}`;
  const newPath = path.join(imagesDir, '阿哈尔捷金马', newFilename);
  fs.copyFileSync(oldPath, newPath);
  newAkhalFiles.push(newFilename);
}

console.log('图片文件名已简化');
console.log('阿帕卢萨马:', newApalossaFiles);
console.log('马瓦里马:', newMarwariFiles);
console.log('阿哈尔捷金马:', newAkhalFiles);

// 更新data.json
const apalossaImages = newApalossaFiles.map(f =&gt; `/images/阿帕卢萨马/${f}`);
const marwariImages = newMarwariFiles.map(f =&gt; `/images/马瓦里马/${f}`);
const akhalImages = newAkhalFiles.map(f =&gt; `/images/阿哈尔捷金马/${f}`);

// 更新内容
data.content[0].cover = apalossaImages[0];
data.content[0].images = apalossaImages;
data.content[0].body = `&lt;p&gt;一百种有趣的灵魂——其一：阿帕卢萨马&lt;/p&gt;&lt;p&gt;&lt;strong&gt;马种：阿帕卢萨马（Appaloosa）&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 原产地：美国西北部/加拿大&lt;/p&gt;&lt;p&gt;- 体高：145-160cm&lt;/p&gt;&lt;p&gt;- 体重：450-500kg&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;strong&gt;📜 历史溯源&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;血统可追溯到16世纪，随西班牙征服者来到美洲新大陆。它们是原住民族内兹珀斯人（Nez Perce）培育的，因在帕卢斯河畔（Palouse River）放牧而得名“Appaloosa”。1877年战争后几乎灭绝，1938年品种协会成立后得到保护，如今重新遍布全球。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 识别特征：看一眼就能记住&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;1. 独一无二的皮毛：雪花纹（Snowflake）、豹纹（Leopard）、毛毯纹（Blanket）等，每一匹都有专属图案。&lt;/p&gt;&lt;p&gt;2. 部分白色巩膜：牛、羊眼白常见，但马少见。&lt;/p&gt;&lt;p&gt;3. 条纹蹄：即使是同一匹马的四肢，也可能是不同条纹。&lt;/p&gt;&lt;p&gt;4. 性情温和：非常聪明、可训，能和人很好地相处，可做多种用途。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏆 性格与能力&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 性格：胆大沉稳、亲人，在越野、西部绕桶、耐力赛上表现出色。&lt;/p&gt;&lt;p&gt;- 适应性强：运动天赋高，全地形适应，全能型选手。&lt;/p&gt;&lt;p&gt;- 颜值在线：斑点控狂喜，出片率超高，怎么拍都好看。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;💡 冷知识&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 它们的LP基因会持续作用，一生都会不停长斑点，越长越特别。&lt;/p&gt;&lt;p&gt;- 即使是兄弟姊妹，也可能是完全不同的花纹。&lt;/p&gt;`;

data.content[1].cover = marwariImages[0];
data.content[1].images = marwariImages;
data.content[1].body = `&lt;p&gt;一百种有趣的灵魂——其二：马瓦里马&lt;/p&gt;&lt;p&gt;来自印度的“精灵耳战马”，在马圈里算得上是辨识度Top级的存在。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏛️ 原生地&lt;/strong&gt;：印度拉贾斯坦邦的Marwar地区，因此得名“Marwari horse”。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;📜 历史&lt;/strong&gt;：约12世纪就有记载，是皇家骑兵的专属战马，能在战场上灵活转弯。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;⚠️ 现状&lt;/strong&gt;：20世纪后数量锐减，被印度政府列为“国宝级”保护品种。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 特点&lt;/strong&gt;：&lt;/p&gt;&lt;p&gt;- 耳朵能旋转180度，像精灵耳一样，这是它们最显著的特征。&lt;/p&gt;&lt;p&gt;- 体型中等，身高约150-165cm，体重约500-540kg，体态优雅，颈长头美，结构紧凑有力。&lt;/p&gt;&lt;p&gt;- 毛色多样：粟色、骝色、枣红、白色都有，其中青毛最有特点。&lt;/p&gt;&lt;p&gt;- 步态优雅，做转马动作时特别漂亮。&lt;/p&gt;&lt;p&gt;马瓦里马是印度拉贾斯坦邦的“活名片”，它的耳朵告诉我们：极致的美，往往藏在细节里。&lt;/p&gt;`;

data.content[2].cover = akhalImages[0];
data.content[2].images = akhalImages;
data.content[2].body = `&lt;p&gt;一百种有趣的灵魂——其三：阿哈尔捷金马&lt;/p&gt;&lt;p&gt;阿哈尔捷金马（Akhal-Teke）来自土库曼斯坦，是国宝，也是世界上最稀有的马种之一，以其独特的金属光泽皮毛闻名。传说中“汗血宝马”就是它们的后代。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏜️ 原生地&lt;/strong&gt;：土库曼斯坦，沙漠绿洲旁的古老品种。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;📜 历史&lt;/strong&gt;：它们的历史超过3000年，1935年在苏联红军的见证下，长途奔袭4000公里，只用84天，一战成名。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 特点&lt;/strong&gt;：&lt;/p&gt;&lt;p&gt;- 体格纤细优雅，头颈精致，肩颈线条很美，整体比例像艺术品。&lt;/p&gt;&lt;p&gt;- 识别特征：皮毛有丝滑的金属光泽，在阳光下闪闪发光，像流动的液体。&lt;/p&gt;&lt;p&gt;它们是土库曼斯坦的骄傲，也是丝绸之路上留下的珍贵遗产。&lt;/p&gt;`;

// 更新Banner
data.banners[0].image = apalossaImages[0];
data.banners[1].image = marwariImages[0];
data.banners[2].image = akhalImages[0];

// 更新快捷入口
data.quick_entries[0].icon = apalossaImages[0];

// 保存
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('data.json 已更新');
