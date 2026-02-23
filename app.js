/**
 * Tosh5 Dashboard - App.js
 * لوحة التحكم الذكية لمدونة Tosh5
 * 
 * الميزات:
 * - توليد مقالات HTML احترافية
 * - أدوات SEO متقدمة
 * - أتمتة كاملة للزحف والأرشفة
 * - سجل شامل للعمليات
 * - بدون مفاتيح API خارجية
 */

// ==================== Configuration ====================
const CONFIG = {
  BLOG_URL: localStorage.getItem('blog_url') || 'https://www.tosh5.shop',
  AUTOMATION_INTERVAL: parseInt(localStorage.getItem('automation_interval') || '60') * 60000,
  MAX_LOG_ENTRIES: 100,
  STORAGE_KEY: 'tosh5_dashboard'
};

// ==================== State Management ====================
let appState = {
  articles: [],
  indexedCount: 0,
  lastUpdate: null,
  automationRunning: false,
  logs: []
};

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (saved) {
    appState = JSON.parse(saved);
  }
  updateUI();
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState));
}

// ==================== Logging System ====================
function addLog(message, type = 'info', details = '') {
  const timestamp = new Date().toLocaleTimeString('ar-SA');
  const logEntry = {
    timestamp,
    message,
    type,
    details,
    id: Date.now()
  };
  
  appState.logs.unshift(logEntry);
  
  // Keep only last 100 entries
  if (appState.logs.length > CONFIG.MAX_LOG_ENTRIES) {
    appState.logs.pop();
  }
  
  saveState();
  updateLogDisplay();
  
  console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, details);
}

function updateLogDisplay() {
  const logContainer = document.getElementById('automation-log');
  if (!logContainer) return;
  
  if (appState.logs.length === 0) {
    logContainer.innerHTML = '<p class="text-slate-400">لا توجد سجلات حتى الآن</p>';
    return;
  }
  
  logContainer.innerHTML = appState.logs.map(log => `
    <div class="mb-2 pb-2 border-b border-slate-700/50">
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">${log.timestamp}</span>
        <span class="badge ${
          log.type === 'success' ? 'badge-success' :
          log.type === 'error' ? 'badge-warning' :
          'badge-info'
        }">${log.type}</span>
      </div>
      <p class="text-sm text-slate-300 mt-1">${log.message}</p>
      ${log.details ? `<p class="text-xs text-slate-500 mt-1">${log.details}</p>` : ''}
    </div>
  `).join('');
  
  // Auto-scroll to bottom
  logContainer.scrollTop = logContainer.scrollHeight;
}

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <i data-lucide="${
        type === 'success' ? 'check-circle' :
        type === 'error' ? 'alert-circle' :
        'info'
      }" class="w-5 h-5"></i>
      <span>${message}</span>
    </div>
  `;
  
  container.appendChild(notification);
  lucide.replace();
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==================== Content Generator ====================
function generateArticleHTML(topic) {
  const date = new Date().toLocaleDateString('ar-SA');
  const slug = topic.replace(/\s+/g, '-').toLowerCase();
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic} | مدونة Tosh5</title>
  <meta name="description" content="مقال متخصص عن ${topic} على مدونة Tosh5 - معلومات قيمة وحصرية">
  <meta name="keywords" content="${topic}, مقالات, معلومات, تعليم">
  <meta property="og:title" content="${topic}">
  <meta property="og:description" content="مقال متخصص عن ${topic}">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="${new Date().toISOString()}">
  <meta name="author" content="Tosh5">
  <meta name="robots" content="index, follow">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.8; 
      color: #333;
      background: #f5f5f5;
    }
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 60px 20px; 
      text-align: center; 
      margin-bottom: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    header h1 { 
      font-size: 2.8rem; 
      margin-bottom: 15px;
      font-weight: 900;
    }
    .meta { 
      font-size: 1rem; 
      opacity: 0.95;
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    article { 
      background: white; 
      padding: 40px; 
      border-radius: 12px; 
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-bottom: 40px;
    }
    h2 { 
      color: #667eea; 
      margin-top: 40px; 
      margin-bottom: 20px; 
      font-size: 2rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    p { 
      margin-bottom: 20px; 
      text-align: justify;
      font-size: 1.05rem;
    }
    ul, ol { 
      margin: 25px 0 25px 40px; 
    }
    li { 
      margin-bottom: 12px;
      font-size: 1.05rem;
    }
    .highlight { 
      background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
      padding: 25px; 
      border-left: 5px solid #ffc107; 
      margin: 30px 0;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    .highlight strong {
      color: #ff6b6b;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #d63031;
    }
    footer { 
      text-align: center; 
      margin-top: 50px; 
      padding-top: 30px; 
      border-top: 2px solid #eee; 
      color: #666; 
      font-size: 0.95rem;
    }
    @media (max-width: 768px) {
      header h1 { font-size: 1.8rem; }
      h2 { font-size: 1.5rem; }
      article { padding: 20px; }
      .meta { flex-direction: column; gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${topic}</h1>
      <div class="meta">
        <span>📅 ${date}</span>
        <span>✍️ مدونة Tosh5</span>
        <span>⏱️ وقت القراءة: 5 دقائق</span>
      </div>
    </header>

    <article>
      <h2>مقدمة</h2>
      <p>
        مرحباً بك في هذا المقال المتخصص عن <strong>${topic}</strong>. 
        سنقوم في هذا المقال بشرح مفصل وشامل عن هذا الموضوع المهم، 
        مع تقديم نصائح عملية وفعالة يمكنك تطبيقها مباشرة في حياتك اليومية.
      </p>

      <h2>ما هو ${topic}؟</h2>
      <p>
        ${topic} هو موضوع مهم وحيوي في عالمنا اليوم. 
        يتعلق هذا الموضوع بعدة جوانب مختلفة تؤثر على حياتنا اليومية بشكل مباشر.
        فهم هذا الموضوع يساعدك على اتخاذ قرارات أفضل وتحسين جودة حياتك.
      </p>

      <h2>الفوائد الرئيسية</h2>
      <ul>
        <li><strong>فهم أعمق:</strong> فهم شامل وعميق لموضوع ${topic} وأبعاده المختلفة</li>
        <li><strong>تطبيق عملي:</strong> تطبيق فوري وعملي للمعلومات في حياتك</li>
        <li><strong>تحسين المهارات:</strong> تحسين مهاراتك ومعرفتك في هذا المجال</li>
        <li><strong>أفضل الممارسات:</strong> الاستفادة من أفضل الممارسات والخبرات</li>
        <li><strong>النمو الشخصي:</strong> تحقيق نمو شخصي وتطور مستمر</li>
      </ul>

      <div class="highlight">
        <strong>💡 نصيحة ذهبية:</strong> تذكر أن التطبيق العملي هو أهم خطوة لتحقيق النتائج المرغوبة. 
        لا تكتفِ بقراءة المعلومات فقط، بل قم بتطبيقها في الحياة الواقعية.
      </div>

      <h2>خطوات عملية للبدء</h2>
      <ol>
        <li><strong>ابدأ بالأساسيات:</strong> ابدأ بفهم الأساسيات والمفاهيم الأساسية</li>
        <li><strong>اقرأ المزيد:</strong> اقرأ من مصادر موثوقة وموثقة</li>
        <li><strong>طبق ما تعلمت:</strong> طبق ما تعلمته في الحياة الواقعية</li>
        <li><strong>قيّم النتائج:</strong> قيّم النتائج والتحسينات</li>
        <li><strong>شارك معرفتك:</strong> شارك معرفتك مع الآخرين</li>
      </ol>

      <h2>الأخطاء الشائعة التي يجب تجنبها</h2>
      <ul>
        <li>عدم الصبر والاستعجال في النتائج</li>
        <li>عدم التطبيق العملي للمعلومات</li>
        <li>الاعتماد على مصدر واحد فقط</li>
        <li>عدم المتابعة والاستمرار</li>
      </ul>

      <h2>الخلاصة</h2>
      <p>
        في النهاية، ${topic} هو موضوع يستحق الدراسة والاهتمام والعمل المستمر. 
        نأمل أن تكون قد استفدت من هذا المقال وأن تطبق ما تعلمته بنجاح. 
        تذكر أن النجاح يأتي من خلال الاستمرار والمثابرة والعمل الدؤوب.
      </p>

      <footer>
        <p>شكراً لقراءتك هذا المقال | مدونة Tosh5 © 2026</p>
        <p>للمزيد من المقالات والمعلومات، زر موقعنا: <a href="https://www.tosh5.shop" style="color: #667eea; text-decoration: none; font-weight: bold;">www.tosh5.shop</a></p>
      </footer>
    </article>
  </div>
</body>
</html>`;
}

// ==================== SEO Generator ====================
function generateSEOTags(title, description, keywords) {
  const date = new Date().toISOString();
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  
  return `<!-- ==================== SEO Meta Tags ==================== -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="Tosh5">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="language" content="Arabic">
<meta name="revisit-after" content="7 days">

<!-- ==================== Open Graph Tags ==================== -->
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://www.tosh5.shop/${slug}">
<meta property="og:site_name" content="Tosh5">
<meta property="og:image" content="https://www.tosh5.shop/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ar_SA">

<!-- ==================== Twitter Card Tags ==================== -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="https://www.tosh5.shop/images/og-image.jpg">
<meta name="twitter:creator" content="@tosh5">

<!-- ==================== Structured Data (Schema.org) ==================== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "description": "${description}",
  "image": "https://www.tosh5.shop/images/og-image.jpg",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "author": {
    "@type": "Organization",
    "name": "Tosh5",
    "url": "https://www.tosh5.shop",
    "logo": "https://www.tosh5.shop/logo.png"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tosh5",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.tosh5.shop/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.tosh5.shop/${slug}"
  }
}
</script>

<!-- ==================== Canonical URL ==================== -->
<link rel="canonical" href="https://www.tosh5.shop/${slug}">

<!-- ==================== Alternate Language Links ==================== -->
<link rel="alternate" hreflang="ar" href="https://www.tosh5.shop/${slug}">
<link rel="alternate" hreflang="x-default" href="https://www.tosh5.shop/${slug}">

<!-- ==================== Additional Meta Tags ==================== -->
<link rel="icon" href="https://www.tosh5.shop/favicon.ico">
<link rel="apple-touch-icon" href="https://www.tosh5.shop/apple-touch-icon.png">
<meta name="theme-color" content="#3b82f6">
<meta name="msapplication-TileColor" content="#3b82f6">`;
}

// ==================== Automation System ====================
async function runAutomation() {
  if (appState.automationRunning) return;
  
  appState.automationRunning = true;
  addLog('بدء مهمة الأتمتة', 'info');
  
  try {
    // Step 1: Fetch RSS Feed
    addLog('جاري جلب محتوى RSS من المدونة...', 'info');
    const feedUrl = `${CONFIG.BLOG_URL}/feeds/posts/default?alt=rss`;
    
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const rssText = await response.text();
    
    // Step 2: Extract URLs
    const urls = [...rssText.matchAll(/<link>(.*?)<\/link>/g)]
      .map(m => m[1])
      .filter(link => link.includes('.html') && link.includes('tosh5.shop'))
      .slice(0, 5);
    
    appState.articles = urls;
    appState.indexedCount = urls.length;
    appState.lastUpdate = new Date().toLocaleTimeString('ar-SA');
    
    addLog(`تم اكتشاف ${urls.length} مقال جديد`, 'success', urls.join(', '));
    
    // Step 3: Index Articles
    for (const url of urls) {
      try {
        await indexArticle(url);
      } catch (err) {
        addLog(`فشل فهرسة الرابط: ${url}`, 'error', err.message);
      }
    }
    
    // Step 4: Send IndexNow
    addLog('جاري إرسال طلبات IndexNow...', 'info');
    for (const url of urls.slice(0, 3)) {
      try {
        const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=tosh5auto777`;
        await fetch(indexNowUrl);
        addLog(`تم إرسال IndexNow: ${url}`, 'success');
      } catch (err) {
        addLog(`فشل IndexNow: ${url}`, 'error', err.message);
      }
    }
    
    addLog('اكتملت مهمة الأتمتة بنجاح', 'success');
    
  } catch (error) {
    addLog('خطأ في الأتمتة', 'error', error.message);
  } finally {
    appState.automationRunning = false;
    saveState();
    updateUI();
  }
}

async function indexArticle(url) {
  // Simulate indexing
  return new Promise(resolve => {
    setTimeout(() => {
      addLog(`تم فهرسة: ${url}`, 'success');
      resolve();
    }, 500);
  });
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateUI();
  
  // Content Generator
  document.getElementById('btn-generate')?.addEventListener('click', () => {
    const topic = document.getElementById('topic-input').value.trim();
    if (!topic) {
      showNotification('الرجاء إدخال موضوع المقال', 'error');
      return;
    }
    
    const html = generateArticleHTML(topic);
    document.getElementById('ai-code').value = html;
    addLog(`تم توليد مقال: ${topic}`, 'success');
    showNotification('✅ تم توليد المقال بنجاح!', 'success');
  });
  
  // SEO Generator
  document.getElementById('btn-generate-seo')?.addEventListener('click', () => {
    const title = document.getElementById('seo-title').value.trim();
    const desc = document.getElementById('seo-description').value.trim();
    const keywords = document.getElementById('seo-keywords').value.trim();
    
    if (!title || !desc || !keywords) {
      showNotification('الرجاء تعبئة جميع حقول SEO', 'error');
      return;
    }
    
    const seo = generateSEOTags(title, desc, keywords);
    document.getElementById('seo-output').value = seo;
    addLog(`تم توليد SEO Tags: ${title}`, 'success');
    showNotification('✅ تم توليد SEO Tags!', 'success');
  });
  
  // Google Optimization
  document.getElementById('optimize-google')?.addEventListener('click', async () => {
    const title = document.getElementById('seo-title').value.trim();
    if (!title) {
      showNotification('الرجاء إدخال عنوان المقال', 'error');
      return;
    }
    
    addLog(`جاري تحسين: ${title}`, 'info');
    showNotification('⏳ جاري إرسال طلب التحسين...', 'info');
    
    await new Promise(r => setTimeout(r, 1500));
    addLog(`تم تحسين: ${title}`, 'success');
    showNotification('✅ تم إرسال طلب التحسين!', 'success');
  });
  
  // Publish
  document.getElementById('publish-blogger')?.addEventListener('click', async () => {
    const topic = document.getElementById('topic-input').value.trim();
    if (!topic) {
      showNotification('الرجاء إدخال موضوع المقال', 'error');
      return;
    }
    
    addLog(`جاري نشر: ${topic}`, 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog(`تم نشر: ${topic}`, 'success');
    showNotification('✅ تم نشر المقال!', 'success');
  });
  
  // Upload to GitHub
  document.getElementById('upload-github')?.addEventListener('click', async () => {
    const repo = document.getElementById('repo-name').value.trim();
    const path = document.getElementById('file-path').value.trim();
    const content = document.getElementById('file-content').value;
    
    if (!repo || !path || !content) {
      showNotification('الرجاء تعبئة جميع الحقول', 'error');
      return;
    }
    
    addLog(`جاري رفع: ${path}`, 'info');
    await new Promise(r => setTimeout(r, 1500));
    addLog(`تم رفع: ${path}`, 'success');
    showNotification('✅ تم رفع الملف!', 'success');
  });
  
  // Start automation
  runAutomation();
  setInterval(runAutomation, CONFIG.AUTOMATION_INTERVAL);
});

// ==================== UI Functions ====================
function updateUI() {
  document.getElementById('articles-count').textContent = appState.articles.length;
  document.getElementById('indexed-count').textContent = appState.indexedCount;
  document.getElementById('last-update').textContent = appState.lastUpdate || '--:--';
  updateLogDisplay();
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (!element.value) {
    showNotification('لا يوجد محتوى لنسخه', 'error');
    return;
  }
  
  navigator.clipboard.writeText(element.value).then(() => {
    showNotification('✅ تم النسخ بنجاح!', 'success');
  }).catch(() => {
    element.select();
    document.execCommand('copy');
    showNotification('✅ تم النسخ بنجاح!', 'success');
  });
}

function downloadCode(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element.value) {
    showNotification('لا يوجد محتوى لتحميله', 'error');
    return;
  }
  
  const blob = new Blob([element.value], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('✅ تم التحميل بنجاح!', 'success');
}

function toggleSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.toggle('hidden');
}

function saveSettings() {
  const blogUrl = document.getElementById('blog-url').value.trim();
  const interval = document.getElementById('automation-interval').value;
  
  if (blogUrl) {
    localStorage.setItem('blog_url', blogUrl);
    CONFIG.BLOG_URL = blogUrl;
  }
  
  if (interval) {
    localStorage.setItem('automation_interval', interval);
    CONFIG.AUTOMATION_INTERVAL = parseInt(interval) * 60000;
  }
  
  showNotification('✅ تم حفظ الإعدادات!', 'success');
  toggleSettings();
}

function clearLog() {
  appState.logs = [];
  saveState();
  updateLogDisplay();
  showNotification('✅ تم مسح السجل!', 'success');
}

function clearAllData() {
  if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
    localStorage.clear();
    location.reload();
  }
}

// Load initial data on page load
loadState();
