const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const POSTS_DIR = "posts";
const OUTPUT_DIR = "posts-html";
const INDEX_FILE = "posts.json";

async function build() {
  await fs.ensureDir(OUTPUT_DIR);

  const files = await fs.readdir(POSTS_DIR);
  const index = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(POSTS_DIR, file);
    const content = await fs.readFile(filePath, "utf-8");

    const { data, content: markdown } = matter(content);

    const htmlContent = marked.parse(markdown);

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.title}</title>
</head>
<body>
  <h1>${data.title}</h1>
  <p>${data.date}</p>
  <div>${htmlContent}</div>
</body>
</html>
`;

    const htmlFileName = file.replace(".md", ".html");
    const outputPath = path.join(OUTPUT_DIR, htmlFileName);

    await fs.writeFile(outputPath, htmlTemplate);

    index.push({
      title: data.title,
      date: data.date,
      path: `posts-html/${htmlFileName}`
    });
  }

  // 按时间倒序
  index.sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

build();
