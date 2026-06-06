
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const horsepicDir = path.join(__dirname, 'horsepic');
const imagesDir = path.join(__dirname, 'server', 'public', 'images');
const dataPath = path.join(__dirname, 'server', 'data.json');

const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

const allFiles = fs.readdirSync(horsepicDir);

console.log('所有文件:', allFiles);

// 按顺序分组
const apalossaFiles = [];
const marwariFiles = [];
const akhalFiles = [];

allFiles.forEach(f =&gt; {
  if (!f.endsWith('.jpg')) return;
  if (f.includes('其一')) apalossaFiles.push(f);
  else if (f.includes('其二')) marwariFiles.push(f);
  else if (f.includes('其三') || f.includes('其3')) akhalFiles.push(f);
});

console.log('\n阿帕卢萨马:', apalossaFiles);
console.log('马瓦里马:', marwariFiles);
console.log('阿哈尔捷金马:', akhalFiles);

// 简单重命名函数
function copyAndRename(srcDir, srcFiles, destDir, prefix) {
  const result = [];
  srcFiles.forEach((f, i) =&gt; {
    const ext = path.extname(f);
    const newName = `${prefix}_${i + 1}${ext}`;
    fs.copyFileSync(
      path.join(srcDir, f),
      path.join(destDir, newName)
    );
    result.push(newName);
  });
  return result;
}

const apalossaNew = copyAndRename(horsepicDir, apalossaFiles, path.join(imagesDir, '阿帕卢萨马'), 'apalossa');
const marwariNew = copyAndRename(horsepicDir, marwariFiles, path.join(imagesDir, '马瓦里马'), 'marwari');
const akhalNew = copyAndRename(horsepicDir, akhalFiles, path.join(imagesDir, '阿哈尔捷金马'), 'akhal');

console.log('\n重命名完成');

// 更新数据
const apalossaImgs = apalossaNew.map(f =&gt; `/images/阿帕卢萨马/${f}`);
const marwariImgs = marwariNew.map(f =&gt; `/images/马瓦里马/${f}`);
const akhalImgs = akhalNew.map(f =&gt; `/images/阿哈尔捷金马/${f}`);

data.content[0].cover = apalossaImgs[0];
data.content[0].images = apalossaImgs;
data.content[0].body = '&lt;p&gt;一百种有趣的灵魂——其一：阿帕卢萨马&lt;/p&gt;&lt;p&gt;&lt;strong&gt;马种：阿帕卢萨马（Appaloosa）&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 原产地：美国西北部/加拿大&lt;/p&gt;&lt;p&gt;- 体高：145-160cm&lt;/p&gt;&lt;p&gt;- 体重：450-500kg&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;strong&gt;📜 历史溯源&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;血统可追溯到16世纪，随西班牙征服者来到美洲新大陆。它们是原住民族内兹珀斯人（Nez Perce）培育的，因在帕卢斯河畔（Palouse River）放牧而得名“Appaloosa”。1877年战争后几乎灭绝，1938年品种协会成立后得到保护，如今重新遍布全球。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 识别特征：看一眼就能记住&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;1. 独一无二的皮毛：雪花纹（Snowflake）、豹纹（Leopard）、毛毯纹（Blanket）等，每一匹都有专属图案。&lt;/p&gt;&lt;p&gt;2. 部分白色巩膜：牛、羊眼白常见，但马少见。&lt;/p&gt;&lt;p&gt;3. 条纹蹄：即使是同一匹马的四肢，也可能是不同条纹。&lt;/p&gt;&lt;p&gt;4. 性情温和：非常聪明、可训，能和人很好地相处，可做多种用途。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏆 性格与能力&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 性格：胆大沉稳、亲人，在越野、西部绕桶、耐力赛上表现出色。&lt;/p&gt;&lt;p&gt;- 适应性强：运动天赋高，全地形适应，全能型选手。&lt;/p&gt;&lt;p&gt;- 颜值在线：斑点控狂喜，出片率超高，怎么拍都好看。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;💡 冷知识&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;- 它们的LP基因会持续作用，一生都会不停长斑点，越长越特别。&lt;/p&gt;&lt;p&gt;- 即使是兄弟姊妹，也可能是完全不同的花纹。&lt;/p&gt;';

data.content[1].cover = marwariImgs[0];
data.content[1].images = marwariImgs;
data.content[1].body = '&lt;p&gt;一百种有趣的灵魂——其二：马瓦里马&lt;/p&gt;&lt;p&gt;来自印度的“精灵耳战马”，在马圈里算得上是辨识度Top级的存在。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏛️ 原生地&lt;/strong&gt;：印度拉贾斯坦邦的Marwar地区，因此得名“Marwari horse”。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;📜 历史&lt;/strong&gt;：约12世纪就有记载，是皇家骑兵的专属战马，能在战场上灵活转弯。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;⚠️ 现状&lt;/strong&gt;：20世纪后数量锐减，被印度政府列为“国宝级”保护品种。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 特点&lt;/strong&gt;：&lt;/p&gt;&lt;p&gt;- 耳朵能旋转180度，像精灵耳一样，这是它们最显著的特征。&lt;/p&gt;&lt;p&gt;- 体型中等，身高约150-165cm，体重约500-540kg，体态优雅，颈长头美，结构紧凑有力。&lt;/p&gt;&lt;p&gt;- 毛色多样：粟色、骝色、枣红、白色都有，其中青毛最有特点。&lt;/p&gt;&lt;p&gt;- 步态优雅，做转马动作时特别漂亮。&lt;/p&gt;&lt;p&gt;马瓦里马是印度拉贾斯坦邦的“活名片”，它的耳朵告诉我们：极致的美，往往藏在细节里。&lt;/p&gt;';

data.content[2].cover = akhalImgs[0];
data.content[2].images = akhalImgs;
data.content[2].body = '&lt;p&gt;一百种有趣的灵魂——其三：阿哈尔捷金马&lt;/p&gt;&lt;p&gt;阿哈尔捷金马（Akhal-Teke）来自土库曼斯坦，是国宝，也是世界上最稀有的马种之一，以其独特的金属光泽皮毛闻名。传说中“汗血宝马”就是它们的后代。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;🏜️ 原生地&lt;/strong&gt;：土库曼斯坦，沙漠绿洲旁的古老品种。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;📜 历史&lt;/strong&gt;：它们的历史超过3000年，1935年在苏联红军的见证下，长途奔袭4000公里，只用84天，一战成名。&lt;/p&gt;&lt;p&gt;&lt;strong&gt;✨ 特点&lt;/strong&gt;：&lt;/p&gt;&lt;p&gt;- 体格纤细优雅，头颈精致，肩颈线条很美，整体比例像艺术品。&lt;/p&gt;&lt;p&gt;- 识别特征：皮毛有丝滑的金属光泽，在阳光下闪闪发光，像流动的液体。&lt;/p&gt;&lt;p&gt;它们是土库曼斯坦的骄傲，也是丝绸之路上留下的珍贵遗产。&lt;/p&gt;';

data.banners[0].image = apalossaImgs[0];
data.banners[1].image = marwariImgs[0];
data.banners[2].image = akhalImgs[0];
data.quick_entries[0].icon = apalossaImgs[0];

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('\ndata.json 已更新');
