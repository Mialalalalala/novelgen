const { GoogleGenerativeAI } = require('@google/generative-ai');

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
      service: 'Gemini Veo Video Generation API',
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

  console.log('Generating video for:', sceneTitle || 'Untitled scene');
  console.log('Prompt:', prompt.substring(0, 100) + '...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use Veo 2 model for video generation
    const model = genAI.getGenerativeModel({ 
      model: "veo-2.0-generate-001"
    });

    // Generate video
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Generate an 8-second cinematic video scene: ${prompt}`
        }]
      }],
      generationConfig: {
        responseModalities: ['video'],
      }
    });

    const response = await result.response;
    
    // Extract video data
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.fileData) {
            return res.status(200).json({
              success: true,
              videoUrl: part.fileData.fileUri,
              mimeType: part.fileData.mimeType,
              sceneTitle
            });
          }
          if (part.inlineData) {
            // Return base64 video data
            return res.status(200).json({
              success: true,
              videoData: part.inlineData.data,
              mimeType: part.inlineData.mimeType,
              sceneTitle
            });
          }
        }
      }
    }

    // If we get here, no video was generated
    return res.status(500).json({ 
      error: 'No video generated',
      details: 'The API response did not contain video data'
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return res.status(500).json({ 
      error: 'Video generation failed',
      details: error.message 
    });
  }
};
