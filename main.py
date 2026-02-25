import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("OPENAI_API_KEY") # Using OPENAI_API_KEY for Gemini

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro') # Using gemini-pro for text generation
else:
    logger.error("GEMINI_API_KEY is not set. Please set it in the .env file.")
    model = None

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        'مرحباً بك في بوت الوكيل الأبدي! أنا هنا لمساعدتك في إنشاء ونشر المقالات على بلوجر.\n'
        'استخدم /help لعرض الأوامر المتاحة.'
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        'يمكنك استخدام الأوامر التالية:\n'
        '/start - بدء البوت\n'
        '/help - عرض هذه الرسالة\n'
        '/write_article <الموضوع> - لكتابة مقال جديد حول موضوع معين\n'
        '/analyze_seo <المقال> - لتحليل SEO لمقال (قيد التطوير)\n'
        '/create_content <الموضوع> - لإنشاء محتوى متنوع (قيد التطوير)\n'
        '/auto_publish - لتفعيل النشر التلقائي (قيد التطوير)'
    )

async def write_article(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not model:
        await update.message.reply_text("عذراً، لا يمكنني توليد المقالات حالياً. مفتاح Gemini API غير متاح.")
        return

    if not context.args:
        await update.message.reply_text("الرجاء تحديد موضوع للمقال. مثال: /write_article فوائد الذكاء الاصطناعي")
        return

    topic = " ".join(context.args)
    await update.message.reply_text(f"جاري كتابة مقال حول: {topic}... قد يستغرق الأمر بعض الوقت.")

    try:
        prompt = f"اكتب مقالاً احترافياً ومتوافقاً مع معايير SEO باللغة العربية حول الموضوع التالي: {topic}. يجب أن يكون المقال شاملاً، جذاباً للقارئ، ويحتوي على مقدمة، فقرات رئيسية، وخاتمة. استخدم عناوين فرعية (H2, H3) ونقاط (lists) لتحسين قابلية القراءة. يجب أن يكون طول المقال حوالي 500-700 كلمة."
        response = model.generate_content(prompt)
        article_text = response.text
        await update.message.reply_text(f"تم كتابة المقال بنجاح:\n\n{article_text}")
    except Exception as e:
        logger.error(f"Error generating article: {e}")
        await update.message.reply_text("عذراً، حدث خطأ أثناء توليد المقال. الرجاء المحاولة مرة أخرى لاحقاً.")

def main() -> None:
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN is not set. Please set it in the .env file.")
        return

    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("write_article", write_article))

    # Placeholder handlers for future commands
    application.add_handler(CommandHandler("analyze_seo", lambda u, c: u.message.reply_text("هذه الميزة قيد التطوير.")))
    application.add_handler(CommandHandler("create_content", lambda u, c: u.message.reply_text("هذه الميزة قيد التطوير.")))
    application.add_handler(CommandHandler("auto_publish", lambda u, c: u.message.reply_text("هذه الميزة قيد التطوير.")))

    logger.info("Bot started polling...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
