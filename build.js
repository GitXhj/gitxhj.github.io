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

  const files = await fs.readdir(POSTS_DIR);
  const index = [];

  // ✅ 只读取一次模板（不要放循环里）
  const template = await fs.readFile(TEMPLATE_PATH, "utf-8");

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");

    // ✅ 解析 frontmatter
    const { data, content } = matter(raw);

    // ✅ markdown → html
    const htmlContent = marked.parse(content);

    // ✅ 替换模板变量
    const finalHtml = template
      .replace(/{{title}}/g, data.title || "")
      .replace(/{{date}}/g, data.date || "")
      .replace(/{{content}}/g, htmlContent);

    const htmlFileName = file.replace(".md", ".html");
    const outputPath = path.join(OUTPUT_DIR, htmlFileName);

    await fs.writeFile(outputPath, finalHtml);

    index.push({
      title: data.title,
      date: data.date,
      path: `posts-html/${htmlFileName}`
    });
  }

  // ✅ 按时间倒序
  index.sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

build();
