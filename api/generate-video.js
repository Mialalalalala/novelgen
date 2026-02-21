const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      service: 'Gemini Imagen Image Generation API',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { prompt, sceneTitle } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log('Generating image for:', sceneTitle || 'Untitled scene');
  console.log('Prompt:', prompt.substring(0, 100) + '...');

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt.substring(0, 500),
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image && image.image.imageBytes) {
        console.log('Image generated successfully!');
        return res.status(200).json({
          success: true,
          imageData: image.image.imageBytes,
          mimeType: 'image/png',
          sceneTitle
        });
      }
    }

    return res.status(500).json({ 
      error: 'No image generated',
      details: 'The API response did not contain image data'
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ 
      error: 'Image generation failed',
      details: error.message 
    });
  }
};
