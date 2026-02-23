// زر توليد مقال HTML
const topicInput = document.getElementById('topic-input');
const aiCodeTextarea = document.getElementById('ai-code');
const btnGenerate = document.getElementById('btn-generate');
const geminiKeyInput = document.getElementById('gemini-key');

btnGenerate.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  const apiKey = geminiKeyInput.value.trim();
  
  if (!topic || !apiKey) {
    return alert('الرجاء إدخال عنوان المقال ومفتاح Gemini API');
  }
  
  btnGenerate.disabled = true;
  btnGenerate.textContent = 'جاري التوليد...';
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `اكتب مقال HTML كامل عن: ${topic}`
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      aiCodeTextarea.value = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('فشل التوليد');
    }
  } catch (error) {
    console.error(error);
    alert('حدث خطأ: ' + error.message);
  } finally {
    btnGenerate.disabled = false;
    btnGenerate.textContent = 'توليد مقال HTML';
  }
});
