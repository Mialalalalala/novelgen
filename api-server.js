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
            content: `你是一位专业的网络小说作家，擅长创作大女主风格的现代都市/古代宫廷/玄幻修仙小说。

写作风格要求：
- 女主角必须聪明独立、有主见、不依附男性
- 女主靠自己的能力和智慧解决问题，逆袭打脸
- 剧情要爽快，节奏明快，高潮迭起
- 加入适当的打脸、复仇、逆袭情节
- 对话要现代化、接地气，符合当代年轻人口味
- 男性角色可以有，但不能抢女主风头
- 故事要有爽点，让读者看得过瘾

格式要求：
- 用中文写作
- 段落之间用空行分隔
- 适当使用章节标题
- 对话用引号标注`
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

// Image Generation Endpoint using OpenAI DALL-E
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, sceneTitle } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file.' 
      })
    }

    console.log('Generating image with DALL-E 3...', { sceneTitle, prompt: prompt.substring(0, 100) })

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.substring(0, 1000),
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `DALL-E API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.data && data.data[0] && data.data[0].url) {
      console.log('Image generated successfully!')
      return res.status(200).json({
        success: true,
        imageUrl: data.data[0].url,
        mimeType: 'image/png',
        sceneTitle
      })
    }

    throw new Error('No image generated from API response')

  } catch (error) {
    console.error('Error generating image:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate image' 
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
