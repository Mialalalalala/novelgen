/**
 * API Route for generating novel content using AI (OpenAI API)
 * 
 * This can be deployed as:
 * - Vercel Serverless Function: Place in /api/generate-novel.js
 * - Netlify Function: Place in /netlify/functions/generate-novel.js
 * - Next.js API Route: Place in /pages/api/generate-novel.js
 * - Express endpoint: Add to your Express server
 * 
 * Environment variables needed:
 * - OPENAI_API_KEY: Your OpenAI API key
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, targetWords } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      })
    }

    // Call OpenAI API
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

    // Return the generated text
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
}

// For Vercel serverless functions
// export default handler

// For Netlify functions, use:
// exports.handler = async (event, context) => {
//   const req = { method: event.httpMethod, body: JSON.parse(event.body) }
//   const res = { status: (code) => ({ json: (data) => ({ statusCode: code, body: JSON.stringify(data) }) }) }
//   return handler(req, res)
// }
