const { GoogleGenAI } = require('@google/genai');
const History = require('../models/History');

const buildPrompt = (code, language, action) => {
  const actionMap = {
    fix: `Fix all bugs and errors in the following ${language} code.`,
    explain: `Explain the following ${language} code in simple, clear terms.`,
    optimize: `Optimize the following ${language} code for performance, readability, and best practices.`,
  };

  return `You are an expert software engineer. ${actionMap[action] || actionMap.fix}

Respond with ONLY a JSON object, no markdown, no code fences:
{"fixedCode":"...","explanation":"...","techStack":"..."}

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;
};

const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

// POST /api/ai/process
const processCode = async (req, res) => {
  try {
    const { code, language = 'javascript', action = 'fix' } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ message: 'No code provided' });
    }

    if (code.length > 8000) {
      return res.status(400).json({ message: 'Code too long. Max 8,000 characters.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'Gemini API key not configured. Please add GEMINI_API_KEY to your server/.env file.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(code, language, action);

    let rawContent = null;
    let lastError = null;

    for (const modelName of MODELS) {
      try {
        console.log(`Trying model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        });
        rawContent = response.text.trim();
        console.log(`✅ Success with: ${modelName}`);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`❌ ${modelName} failed: ${err.message?.slice(0, 100)}`);
        const msg = err.message || '';
        const isRetryable = msg.includes('503') || msg.includes('UNAVAILABLE') ||
          msg.includes('404') || msg.includes('not found') || msg.includes('no longer available');
        if (!isRetryable) throw err; // Auth or other hard error — stop immediately
      }
    }

    if (!rawContent) {
      throw lastError || new Error('All models failed');
    }

    let parsed;
    try {
      const cleaned = rawContent
        .replace(/^```json?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error. Raw:', rawContent.slice(0, 200));
      return res.status(500).json({ message: 'AI returned invalid format. Please try again.' });
    }

    if (!parsed.fixedCode || !parsed.explanation || !parsed.techStack) {
      return res.status(500).json({ message: 'Incomplete AI response. Please try again.' });
    }

    // Save to history (non-fatal)
    try {
      await History.create({
        userId: req.user._id,
        originalCode: code,
        fixedCode: parsed.fixedCode,
        explanation: parsed.explanation,
        techStack: parsed.techStack,
        language,
        action,
      });
    } catch (histErr) {
      console.error('History save error:', histErr.message);
    }

    res.json(parsed);
  } catch (error) {
    console.error('AI processing error:', error.message);
    const msg = error?.message || '';

    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ message: 'Rate limit reached. Please wait 1 minute and try again.' });
    }
    if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
      return res.status(503).json({ message: 'Gemini is overloaded right now. Please try again in 30 seconds.' });
    }
    if (msg.includes('API key') || msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
      return res.status(500).json({ message: 'Invalid Gemini API key. Please check your .env file.' });
    }

    res.status(500).json({ message: `Processing failed: ${msg.slice(0, 100)}` });
  }
};

// GET /api/ai/history
const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// DELETE /api/ai/history/:id
const deleteHistoryItem = async (req, res) => {
  try {
    const item = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!item) {
      return res.status(404).json({ message: 'History item not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete history item' });
  }
};

module.exports = { processCode, getHistory, deleteHistoryItem };