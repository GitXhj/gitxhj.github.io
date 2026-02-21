---
title: 用GitHub与Deno搭建一个简单的博客系统
date: 2026-02-21T14:18:36.916Z
---

## 主要流程

`浏览器/客户端编写文章`-`提交到Deno平台并校验密钥`-`向GitHub仓库提交或更新Markdown格式的文章文件`-`GitHub action检测并处理为HTMl文档`-`action build 页面`-`读取posts.json获取列表`

Cilent 
 ↓
Deno Server (Auth + GitHub API)
  ↓
GitHub Repository
  ↓
GitHub Action (Build)
  ↓
HTML + posts.json
  ↓
Frontend Display

### Deno

- 通过 Deno.env.get() 方法获取 GitHub Token、仓库信息、管理员密钥等。变量用于认证和标识目标仓库。
- createSlug(title: string)将文章标题转换为适合文件名和 URL 的 slug。
- base64Encode(str: string)：将字符串编码为 Base64，GitHub API 提交文件时要求内容为 Base64。

**文件创建或更新**
createOrUpdateFile(path: string, content: string)：
先检查目标仓库下的该文件是否存在（GET）。
如果存在，获取其 SHA 并作为更新依据；否则直接创建。
调用 GitHub API 的 PUT 接口（contents），提交或更新文件内容。

---
### GIthub Action ：Build.js&build.yml
**build.yml**
- 代码拉取（Checkout）
使用 actions/checkout@v4 拉取仓库内容。
- Node 环境搭建（Setup Node）
使用 actions/setup-node@v4 配置 Node.js v20 环境。
依赖安装（Install dependencies）
- 通过 npm install marked gray-matter fs-extra 安装构建脚本所需依赖：
marked：Markdown 解析为 HTML。
gray-matter：解析 frontmatter（YAML 元数据）。
fs-extra：增强的文件系统操作。

**build.js** **根据HTMl原模板与MD原文档，构建HTML**
POSTS_DIR：Markdown 原文目录
OUTPUT_DIR：生成 HTML 文件目录
INDEX_FILE：索引文件
TEMPLATE_PATH：HTML 模板文件位置

*gray-matter 解析 Markdown 文件头部的 YAML 区块，提取如标题（title）、日期（date）等字段。*


---

⚠ **不要把编辑页面暴露在Github Pages上，避免DenoApi泄露**

---

**GPT总结**
- 自动化建站流程：通过 GitHub Actions 实现代码和内容驱动的自动部署/构建。
- 依赖最小化、易复现：不用复杂打包工具，直接用脚本搭配少量 npm 包，易于理解和维护。
- Frontmatter+Markdown 优雅内容管理：内容结构化、元数据与内容分离，兼容主流写作习惯。
- HTML 模板替换：实现简单动态页面生成，方便自定义页面风格。
- 产物自动提交：保证源码和构建产物同步管理，适合静态部署场景（GitHub Pages 等）。
- 高效率实现：仅一份脚本，实现批量文件处理、索引生成和格式转换。
- 时间排序：通过 JSON 索引文件预排序，为前端提供高效数据支持。


--END--
By Grodio's Paw 🐾


