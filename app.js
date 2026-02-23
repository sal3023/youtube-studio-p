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

// رفع الملفات إلى GitHub (بدون مفتاح)
btnUploadGitHub.addEventListener("click", async () => {
  const repo = repoNameInput.value.trim();
  const path = filePathInput.value.trim();
  const content = fileContentInput.value;

  if (!repo || !path || !content) return alert("الرجاء تعبئة جميع الحقول");

  try {
    // محاكاة رفع الملف (بدون GitHub Token)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`✅ تم رفع الملف بنجاح!\n\nالمستودع: ${repo}\nالمسار: ${path}\n\n(هذه نسخة تجريبية بدون GitHub Token)`);
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء رفع الملف");
  }
});
