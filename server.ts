import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Helper to construct GoogleGenAI instance on server
function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in process.env');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Analyze Carpet Image (Multimodal Front or Back)
app.post('/api/gemini/analyze-rug', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', analysisType = 'auto', userNotes = '', targetLang = 'fa' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 is required.' });
    }

    const ai = getAi();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const langInstruction = targetLang === 'en'
      ? 'Respond strictly in English language.'
      : targetLang === 'ar'
      ? 'Respond strictly in Arabic language.'
      : 'Respond strictly in fluent Persian (Farsi) language with Iranian carpet bazaar terminology.';

    const systemPrompt = `You are a world-renowned master expert and appraiser of handmade Persian carpets, representing the legacy of Hossein Alimiri & Sons Carpet Merchant in the Grand Iranian Carpet Bazaar.
Analyze the provided carpet image with deep technical precision.

${langInstruction}

Determine if this image shows:
1. The BACK WEAVE (reverse side) of a rug -> focus on knot density, Raj count (knots per 7 centimeters), warp/weft material (silk vs cotton), knot type (Senneh/Persian vs Giordes/Turkish), and weave precision.
2. The FRONT DESIGN of a rug -> focus on origin/region (e.g. Tabriz, Isfahan, Qom, Nain, Kashan, Shiraz/Ghashghai, Bijar, Kerman), pattern style (Lachak Toranj, Afshan, Mahi, Botteh, Tree of Life, Hunting), dye quality (natural vegetable dye vs synthetic), pile height, age/condition, and estimated market value tier.

Return a valid JSON object with the exact following schema:
{
  "detectedSide": "back" | "front" | "detail",
  "originRegion": "string (e.g., Tabriz / تبریز)",
  "designStyle": "string (e.g., Lachak Toranj / لچک ترنج)",
  "rajEstimate": number (estimated knots per 7 cm, e.g. 50),
  "totalKnotDensitySqMeter": number (e.g. 510000),
  "warpWeftMaterial": "string (e.g., Silk Warp / چله ابریشم)",
  "dyeType": "string (e.g., Natural Vegetable Dyes / رنگرزی گیاهی)",
  "knotType": "string (e.g., Asymmetric Persian Knot / گره فارسی)",
  "estimatedValueUSD": "string (e.g., $2,500 - $3,800 USD)",
  "estimatedValueToman": "string (e.g., ۱۵۰ تا ۲۲۰ میلیون تومان)",
  "authenticityScore": number (1 to 100),
  "summaryTitle": "string",
  "detailedAppraisal": "string (3-4 technical sentences)",
  "bazaarTips": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this handmade carpet photo. User notes: "${userNotes}". Analysis preference: ${analysisType}. ${systemPrompt}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-rug:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze carpet image.' });
  }
});

// 2. Translate Bazaar Terminology
app.post('/api/gemini/translate-term', async (req, res) => {
  try {
    const { term, targetLang = 'en', sourceLang = 'fa' } = req.body;

    if (!term) {
      return res.status(400).json({ error: 'Term string is required.' });
    }

    const ai = getAi();

    const systemPrompt = `You are a Persian carpet market dictionary and expert cultural interpreter for the Hossein Alimiri & Sons Carpet Merchant.
Translate and explain the carpet market jargon or term "${term}" into target language: "${targetLang}".

Return a valid JSON object with the schema:
{
  "originalTerm": "string",
  "translatedTerm": "string",
  "phoneticPronunciation": "string",
  "literalMeaning": "string",
  "bazaarContext": "string (Detailed explanation of how this term is used in negotiation or carpet evaluation)",
  "exampleSentence": "string",
  "relatedTerms": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/translate-term:', error);
    return res.status(500).json({ error: error.message || 'Failed to translate term.' });
  }
});

// 3. Text to Speech for Terms & Appraisal Audio
app.post('/api/gemini/speech', async (req, res) => {
  try {
    const { text, voice = 'Kore', style = 'Warm, respectful carpet expert' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const ai = getAi();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: { style },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'Audio data was not generated.' });
    }

    return res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    console.error('Error in /api/gemini/speech:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate speech audio.' });
  }
});

// Vite integration in Dev mode, or static serving in Prod mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const templatePath = path.resolve(__dirname, 'index.html');
      const fs = await import('fs');
      let template = fs.readFileSync(templatePath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Carpet Assistant server running on port ${PORT}`);
});
