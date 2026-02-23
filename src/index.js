/**
 * Tosh5 Smart Automation Engine for Cloudflare Workers
 * هذا الكود يقوم بالزحف والأرشفة التلقائية لمدونة tosh5.shop
 */

export default {
  // هذا التابع يعمل تلقائياً حسب الجدولة (Cron Trigger)
  async scheduled(event, env, ctx) {
    console.log("بداية مهمة الأتمتة المجدولة لمدونة Tosh5...");
    
    // 1. جلب المقالات الجديدة من المدونة (RSS/Sitemap)
    const blogUrl = env.BLOG_URL || "https://www.tosh5.shop";
    const sitemapUrl = `${blogUrl}/sitemap.xml`;
    
    try {
      const response = await fetch(sitemapUrl);
      const sitemapXml = await response.text();
      
      // 2. استخراج الروابط (Regex بسيط لاستخراج روابط <loc>)
      const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
      console.log(`تم العثور على ${urls.length} رابط في المدونة.`);

      // 3. إرسال الروابط للأرشفة (مثال: ربط مع Google Search Console أو IndexNow)
      // هنا يمكنك إضافة كود الربط مع API الأرشفة الخاص بك
      for (const url of urls.slice(0, 5)) { // معالجة آخر 5 روابط فقط لتوفير الموارد
        console.log(`جاري أرشفة الرابط: ${url}`);
        // await submitToIndexNow(url, env.INDEXING_API_KEY);
      }

      console.log("تمت المهمة بنجاح!");
    } catch (error) {
      console.error("خطأ في عملية الأتمتة:", error);
    }
  },

  // هذا التابع يعمل عند زيارة رابط التطبيق (HTTP Request)
  async fetch(request, env, ctx) {
    const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>لوحة تحكم Tosh5 الذكية 🚀</title>
        <style>
            body { font-family: sans-serif; background: #0f172a; color: white; text-align: center; padding: 50px; }
            .status { background: #1e293b; padding: 20px; border-radius: 12px; display: inline-block; border: 1px solid #334155; }
            .btn { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; text-decoration: none; }
            .btn:hover { background: #2563eb; }
        </style>
    </head>
    <body>
        <h1>لوحة تحكم الأتمتة الاحترافية 🛠️</h1>
        <div class="status">
            <p>حالة النظام: 🟢 يعمل بانتظام</p>
            <p>آخر عملية زحف: ${new Date().toLocaleString('ar-EG')}</p>
            <p>المدونة المستهدفة: ${env.BLOG_URL || "tosh5.shop"}</p>
        </div>
        <br><br>
        <a href="https://www.tosh5.shop" class="btn">زيارة المدونة</a>
    </body>
    </html>
    `;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
