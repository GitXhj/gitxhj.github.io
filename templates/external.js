const el = document.getElementById('post-date');
const rawDate = el.dataset.date;

const postDate = new Date(rawDate);

// 转为上海时间
const formatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});

const shanghaiTime = formatter.format(postDate);

// 计算多久之前
const now = new Date();
const diffMs = now - postDate;
const diffMinutes = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMinutes / 60);
const diffDays = Math.floor(diffHours / 24);

let relativeTime = '';

if (diffMinutes < 1) {
  relativeTime = '刚刚';
} else if (diffMinutes < 60) {
  relativeTime = `${diffMinutes} 分钟前`;
} else if (diffHours < 24) {
  relativeTime = `${diffHours} 小时前`;
} else {
  relativeTime = `${diffDays} 天前`;
}

el.textContent = `${shanghaiTime} · ${relativeTime}`;
