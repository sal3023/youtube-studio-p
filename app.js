import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

/* ============================= */
/* 1️⃣ توليد مقال AI */
/* ============================= */
app.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Write a high CPC SEO optimized HTML article about ${topic}. Include H1, H2, H3, FAQ section and strong CTA.`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()

    res.json({
      success: true,
      article:
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Generation failed"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/* ============================= */
/* 2️⃣ نشر مباشر إلى بلوجر */
/* ============================= */
app.post("/publish", async (req, res) => {
  try {
    const { title, content, accessToken } = req.body

    const blogId = process.env.BLOG_ID

    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kind: "blogger#post",
          title,
          content
        })
      }
    )

    const data = await response.json()

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/* ============================= */
/* 3️⃣ أرشفة Google فورية */
/* ============================= */
app.post("/index", async (req, res) => {
  try {
    const { url, accessToken } = req.body

    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED"
        })
      }
    )

    const data = await response.json()

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/* ============================= */
/* 4️⃣ اختبار السيرفر */
/* ============================= */
app.get("/", (req, res) => {
  res.send("Tosh5 AI Blogger Backend Running 🚀")
})

/* ============================= */
/* تشغيل السيرفر */
/* ============================= */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
