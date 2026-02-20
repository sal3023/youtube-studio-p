// عناصر DOM
const geminiInput = document.getElementById("gemini-key");
const blogIdInput = document.getElementById("blog-id");
const bloggerTokenInput = document.getElementById("blogger-token");
const googleKeyInput = document.getElementById("google-key");
const githubTokenInput = document.getElementById("github-token");
const btnSaveKeys = document.getElementById("save-keys");

const repoNameInput = document.getElementById("repo-name");
const fileContentInput = document.getElementById("file-content");
const filePathInput = document.getElementById("file-path");
const btnUploadGitHub = document.getElementById("upload-github");

// حفظ المفاتيح في localStorage (لتجربة محلية)
btnSaveKeys.addEventListener("click", () => {
  const keys = {
    GEMINI_KEY: geminiInput.value.trim(),
    BLOG_ID: blogIdInput.value.trim(),
    BLOGGER_TOKEN: bloggerTokenInput.value.trim(),
    GOOGLE_KEY: googleKeyInput.value.trim(),
    GITHUB_TOKEN: githubTokenInput.value.trim()
  };
  localStorage.setItem("tosh5_keys", JSON.stringify(keys));
  alert("تم حفظ المفاتيح مؤقتًا ✅");
});

// رفع الملفات إلى GitHub
btnUploadGitHub.addEventListener("click", async () => {
  const keys = JSON.parse(localStorage.getItem("tosh5_keys") || "{}");
  const token = keys.GITHUB_TOKEN;
  const repo = repoNameInput.value.trim();
  const path = filePathInput.value.trim();
  const content = fileContentInput.value;

  if (!token || !repo || !path || !content) return alert("الرجاء تعبئة جميع الحقول");

  try {
    // التشفير Base64 لمحتوى الملف
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `رفع الملف ${path} عبر Tosh5 Dashboard`,
        content: base64Content
      })
    });

    const data = await res.json();
    if (data.content) alert("تم رفع الملف بنجاح ✅");
    else alert("فشل رفع الملف ❌: " + (data.message || ""));
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء رفع الملف");
  }
});
