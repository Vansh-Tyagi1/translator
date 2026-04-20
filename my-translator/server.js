const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const LANG_CODES = {
  Hindi: 'hi',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Japanese: 'ja',
  Chinese: 'zh',
  Arabic: 'ar',
  Portuguese: 'pt',
  Russian: 'ru',
  Korean: 'ko',
  Italian: 'it',
  Turkish: 'tr'
};

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const langCode = LANG_CODES[targetLang] || 'hi';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Translation success:", data.responseData.translatedText);
    res.json({ translation: data.responseData.translatedText });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));