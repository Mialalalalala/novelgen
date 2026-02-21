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
    const ai = new GoogleGenAI({ apiKey });

    // Start video generation (async operation)
    const operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt.substring(0, 500),
      config: {
        personGeneration: 'dont_allow',
        aspectRatio: '16:9',
      },
    });

    console.log('Video generation started, polling for completion...');

    // Poll for completion (max 5 minutes)
    let attempts = 0;
    const maxAttempts = 30;
    let currentOperation = operation;

    while (!currentOperation.done && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      currentOperation = await ai.operations.get(currentOperation);
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}...`);
    }

    if (!currentOperation.done) {
      throw new Error('Video generation timed out');
    }

    if (currentOperation.response && currentOperation.response.generatedVideos) {
      const video = currentOperation.response.generatedVideos[0];
      if (video && video.video) {
        console.log('Video generated successfully!');
        return res.status(200).json({
          success: true,
          videoUrl: video.video.uri,
          mimeType: 'video/mp4',
          sceneTitle
        });
      }
    }

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
