require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const ANTIGRAVITY_URL = 'https://cloudcode-pa.googleapis.com/v1internal:generateContent';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Antigravity API', 
    version: '1.0.0',
    endpoints: {
      generate: 'POST /api/generate'
    }
  });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  const { 
    model = 'gemini-3-pro-high', 
    prompt, 
    projectId, 
    accessToken, 
    systemPrompt = 'Eres un asistente útil para desarrollo de aplicaciones.',
    maxTokens = 1000,
    temperature = 0.7
  } = req.body;

  // Validate required fields
  if (!prompt || !projectId || !accessToken) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: prompt, projectId, accessToken' 
    });
  }

  try {
    const requestBody = {
      project: projectId,
      model,
      request: {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { 
          maxOutputTokens: maxTokens, 
          temperature 
        }
      },
      userAgent: 'antigravity-custom-api',
      requestId: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const response = await axios.post(ANTIGRAVITY_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'antigravity/1.15.8',
        'X-Goog-Api-Client': 'google-cloud-sdk vscode_cloudshelleditor/0.1',
        'Client-Metadata': JSON.stringify({ 
          ideType: 'IDE_UNSPECIFIED', 
          platform: 'PLATFORM_UNSPECIFIED', 
          pluginType: 'GEMINI' 
        })
      },
      timeout: 30000
    });

    const result = response.data.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error en respuesta';
    
    res.json({ 
      success: true, 
      content: result,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Antigravity API:', error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'Internal server error'
    });
  }
});

// List available models endpoint
app.get('/api/models', (req, res) => {
  res.json({
    success: true,
    models: [
      { 
        id: 'gemini-3-pro-high', 
        name: 'Gemini 3 Pro', 
        description: 'Modelo rápido para código general',
        provider: 'Google'
      },
      { 
        id: 'claude-sonnet-4-5', 
        name: 'Claude Sonnet 4.5', 
        description: 'Razonamiento complejo y análisis',
        provider: 'Anthropic'
      },
      { 
        id: 'claude-sonnet-4-5-thinking', 
        name: 'Claude Sonnet Thinking', 
        description: 'Tareas largas con thinking budget',
        provider: 'Anthropic'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Antigravity API running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
