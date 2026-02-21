/**
 * Simple local API server for testing AI novel generation
 * Supports OpenAI API
 * 
 * Usage:
 * 1. Install dependencies: npm install express dotenv
 * 2. Create .env file with: OPENAI_API_KEY=your-key-here
 * 3. Run: node api-server.js
 * 4. Server will start on http://localhost:3000
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.post('/api/generate-novel', async (req, res) => {
  try {
    const { prompt, targetWords } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file.' 
      })
    }

    console.log('Generating novel content with OpenAI...', { prompt, targetWords })

    // OpenAI API endpoint and format
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo' for faster/cheaper
        messages: [
          {
            role: 'system',
            content: 'You are a creative fiction writer. Write engaging novel content in Chinese. Format your response with clear paragraphs separated by blank lines. Use chapter headings when appropriate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.floor(targetWords * 1.5), // Rough estimate: 1 token ≈ 0.75 words
        temperature: 0.8, // Higher temperature for more creative content
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices[0]?.message?.content

    if (!generatedText) {
      throw new Error('No content generated from AI')
    }

    console.log('Novel generated successfully!', {
      tokens: data.usage?.total_tokens,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      words: generatedText.split(/\s+/).length
    })

    res.status(200).json({ 
      content: generatedText,
      usage: data.usage 
    })

  } catch (error) {
    console.error('Error generating novel:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate novel content' 
    })
  }
})

// Video Generation Endpoint using Gemini Veo 2
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, sceneTitle } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env file.' 
      })
    }

    console.log('Generating video with Gemini Veo 2...', { sceneTitle, prompt: prompt.substring(0, 100) })

    const { GoogleGenerativeAI } = require('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    
    const model = genAI.getGenerativeModel({ 
      model: "veo-2.0-generate-001"
    })

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
    })

    const response = await result.response
    
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.fileData) {
            console.log('Video generated successfully!')
            return res.status(200).json({
              success: true,
              videoUrl: part.fileData.fileUri,
              mimeType: part.fileData.mimeType,
              sceneTitle
            })
          }
          if (part.inlineData) {
            console.log('Video generated successfully (inline)!')
            return res.status(200).json({
              success: true,
              videoData: part.inlineData.data,
              mimeType: part.inlineData.mimeType,
              sceneTitle
            })
          }
        }
      }
    }

    throw new Error('No video generated from API response')

  } catch (error) {
    console.error('Error generating video:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate video' 
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Novel & Video Generation API is running',
    providers: {
      novel: 'OpenAI',
      video: 'Gemini Veo 2'
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 AI API server running on http://localhost:${PORT}`)
  console.log(`📝 Novel Generation: OpenAI`)
  console.log(`🎬 Video Generation: Gemini Veo 2`)
  console.log(`🔑 Required env vars: OPENAI_API_KEY, GEMINI_API_KEY`)
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not found!')
  }
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found!')
  }
})
