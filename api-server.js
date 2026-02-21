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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Novel Generation API is running',
    provider: 'OpenAI'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 AI Novel Generation API server running on http://localhost:${PORT}`)
  console.log(`📝 Using OpenAI API`)
  console.log(`🔑 Make sure OPENAI_API_KEY is set in .env file`)
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables!')
  }
})
