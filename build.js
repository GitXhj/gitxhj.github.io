const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const POSTS_DIR = "posts";
const OUTPUT_DIR = "posts-html";
const INDEX_FILE = "posts.json";
const TEMPLATE_PATH = "templates/post.html";

async function build() {
  await fs.ensureDir(OUTPUT_DIR);

  // --- 修改点 1: 初始化时读取旧的 index 数据 ---
  let index = [];
  if (await fs.pathExists(INDEX_FILE)) {
    try {
      index = await fs.readJson(INDEX_FILE);
    } catch (err) {
      console.error("读取旧 index 失败，将创建新索引", err);
      index = [];
    }
  }

  const files = await fs.readdir(POSTS_DIR);
  const template = await fs.readFile(TEMPLATE_PATH, "utf-8");

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    const htmlContent = marked.parse(content);

    const finalHtml = template
      .replace(/{{title}}/g, data.title || "")
      .replace(/{{date}}/g, data.date || "")
      .replace(/{{content}}/g, htmlContent);

    const htmlFileName = file.replace(".md", ".html");
    const outputPath = path.join(OUTPUT_DIR, htmlFileName);

    await fs.writeFile(outputPath, finalHtml);

    // --- 修改点 3: 防止重复添加相同的文章 ---
    const postPath = `posts-html/${htmlFileName}`;
    const exists = index.find(item => item.path === postPath);
    
    if (!exists) {
      index.push({
        title: data.title,
        date: data.date,
        path: postPath
      });
    }
  }

  // ✅ 按时间倒序（确保新旧文章混合后顺序正确）
  index.sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log("Build completed!");
}

build();
