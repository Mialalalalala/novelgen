import React, {useState} from 'react'
import {BookIcon} from '@sanity/icons'
import {Stack, Text, TextInput, useToast} from '@sanity/ui'
import {
  type DocumentActionDescription,
  type DocumentActionConfirmDialogProps,
  useClient,
} from 'sanity'

export default (props: any): DocumentActionDescription | undefined => {
  const {draft, published, type, id} = props
  const doc = draft || published
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState(doc?.title || '')
  const [genre, setGenre] = useState(doc?.genre || 'fantasy')
  const [wordCount, setWordCount] = useState('1000')
  const toast = useToast()
  const client = useClient({apiVersion: '2024-01-01'})

  // Only show for novel documents
  if (type !== 'novel') {
    return undefined
  }

  // Get the correct document ID (prefer draft, fallback to published)
  const getDocumentId = () => {
    if (draft?._id) {
      return draft._id
    }
    if (published?._id) {
      // If only published exists, we need to create/update draft
      return `drafts.${published._id}`
    }
    // If neither exists, use the id from props (for new documents)
    return id?.startsWith('drafts.') ? id : `drafts.${id}`
  }

  const dialog: DocumentActionConfirmDialogProps = {
    message: (
      <Stack space={4}>
        <Text weight="semibold" size={1}>Generate AI Novel Content</Text>
        <Text size={1}>Fill in the following information to generate novel content:</Text>
        <Stack space={3}>
          <div>
            <Text size={1} weight="medium" style={{display: 'block', marginBottom: '4px'}}>
              Title
            </Text>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="Enter novel title"
            />
          </div>
          <div>
            <Text size={1} weight="medium" style={{display: 'block', marginBottom: '4px'}}>
              Genre
            </Text>
            <select
              value={genre}
              onChange={(e) => setGenre(e.currentTarget.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="urban-revenge">都市逆袭 (职场复仇/商战)</option>
              <option value="ancient-palace">古代宫廷 (宫斗/权谋)</option>
              <option value="cultivation">玄幻修仙 (女强/逆袭)</option>
              <option value="ceo-romance">豪门总裁 (独立女主)</option>
              <option value="rebirth">重生复仇 (打脸爽文)</option>
              <option value="entertainment">娱乐圈 (逆袭成名)</option>
              <option value="mystery">悬疑推理 (女侦探)</option>
            </select>
          </div>
          <div>
            <Text size={1} weight="medium" style={{display: 'block', marginBottom: '4px'}}>
              Target Word Count
            </Text>
            <TextInput
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.currentTarget.value)}
              placeholder="1000"
            />
          </div>
        </Stack>
      </Stack>
    ),
    onCancel: () => setDialogOpen(false),
    onConfirm: async () => {
      if (!title.trim()) {
        toast.push({
          status: 'error',
          title: 'Title cannot be empty',
        })
        return
      }

      const targetWords = parseInt(wordCount) || 1000
      
      const genreDescriptions: Record<string, string> = {
        'urban-revenge': '都市逆袭爽文，女主在职场/商战中被陷害后绝地反击，一路打脸白莲花和渣男，最终走上人生巅峰',
        'ancient-palace': '古代宫廷权谋文，女主凭借智慧在后宫/朝堂中步步为营，揭穿阴谋，打脸对手，成为人生赢家',
        'cultivation': '玄幻修仙女强文，女主从废柴逆袭成强者，一路碾压天才，打脸看不起她的人',
        'ceo-romance': '豪门总裁文，但女主独立自强，不做花瓶，靠自己能力赢得尊重和爱情',
        'rebirth': '重生复仇爽文，女主带着前世记忆重生，一一打脸害过她的人，改写命运',
        'entertainment': '娱乐圈逆袭文，女主从小透明成长为巨星，打脸黑粉和绿茶，走向人生巅峰',
        'mystery': '悬疑推理文，女主是聪明冷静的侦探/律师，靠智慧破案，打脸质疑她的人',
      }
      
      const genreDesc = genreDescriptions[genre] || '大女主逆袭爽文'
      const promptText = `请创作一篇大女主风格的小说，标题是《${title}》。

类型：${genreDesc}

要求：
- 字数约${targetWords}字
- 女主必须聪明、独立、有主见
- 要有明显的爽点和打脸情节
- 节奏要快，高潮迭起
- 语言现代化，对话接地气
- 让读者看得过瘾！

请直接开始写正文内容。`

      try {
        toast.push({
          status: 'info',
          title: 'Generating novel content...',
        })

        const generatedContent = await generateNovelContent(promptText, targetWords)
        const documentId = getDocumentId()

        // Check if document exists, if not create it
        try {
          const existingDoc = await client.getDocument(documentId).catch(() => null)
          
          if (!existingDoc) {
            // Document doesn't exist, create it
            await client.create({
              _id: documentId,
              _type: 'novel',
              title: title,
              genre: genre,
              content: generatedContent,
              author: 'AI Generated',
              wordCount: countWords(generatedContent),
              status: 'draft',
            })
          } else {
            // Document exists, update it
            await client
              .patch(documentId)
              .set({
                title: title,
                genre: genre,
                content: generatedContent,
                author: 'AI Generated',
                wordCount: countWords(generatedContent),
                status: 'draft',
              })
              .commit()
          }
        } catch (patchError: any) {
          // If patch fails, try to create the document
          if (patchError.message?.includes('not found')) {
            await client.create({
              _id: documentId,
              _type: 'novel',
              title: title,
              genre: genre,
              content: generatedContent,
              author: 'AI Generated',
              wordCount: countWords(generatedContent),
              status: 'draft',
            })
          } else {
            throw patchError
          }
        }

        toast.push({
          status: 'success',
          title: 'Novel generated successfully!',
        })

        setDialogOpen(false)
      } catch (error: any) {
        toast.push({
          status: 'error',
          title: 'Generation failed',
          description: error.message,
        })
      }
    },
    type: 'confirm',
  }

  return {
    tone: 'primary',
    dialog: dialogOpen && dialog,
    icon: BookIcon,
    label: 'Generate with AI',
    shortcut: 'Ctrl+Alt+G',
    onHandle: () => {
      setDialogOpen(true)
    },
  }
}

// Helper function to generate novel content using AI API
async function generateNovelContent(prompt: string, targetWords: number): Promise<any[]> {
  // Option 1: Call your API route (recommended for production)
  // Replace this URL with your deployed API endpoint
  // In Vite/Sanity Studio, use import.meta.env instead of process.env
  const API_URL = import.meta.env.SANITY_STUDIO_AI_API_URL || 'http://localhost:3000/api/generate-novel'
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        targetWords,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.statusText}`)
    }

    const data = await response.json()
    return convertTextToBlocks(data.content)

  } catch (error: any) {
    // Fallback: If API is not available, show error
    throw new Error(`AI generation failed: ${error.message}. Please ensure the API service is running and configured correctly.`)
  }

  // Option 2: Direct OpenAI API call (requires API key in environment)
  // Uncomment below if you want to call OpenAI directly from client
  // WARNING: This exposes your API key in the client bundle. Use Option 1 for production!
  /*
  const apiKey = process.env.SANITY_STUDIO_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Set SANITY_STUDIO_OPENAI_API_KEY environment variable.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative fiction writer. Write engaging novel content in Chinese. Format your response with clear paragraphs separated by blank lines.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: Math.floor(targetWords * 1.5),
      temperature: 0.8,
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

  return convertTextToBlocks(generatedText)
  */
}

// Convert plain text to Sanity block format
function convertTextToBlocks(text: string): any[] {
  const paragraphs = text.split('\n\n').filter((p) => p.trim())
  return paragraphs.map((paragraph) => ({
    _type: 'block',
    _key: `block-${Math.random().toString(36).substr(2, 9)}`,
    style: paragraph.startsWith('#') ? 'h1' : paragraph.startsWith('##') ? 'h2' : 'normal',
    children: [
      {
        _type: 'span',
        _key: `span-${Math.random().toString(36).substr(2, 9)}`,
        text: paragraph.replace(/^#+\s*/, ''),
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

// Count words in block content
function countWords(blocks: any[]): number {
  return blocks.reduce((count, block) => {
    if (block.children) {
      return (
        count +
        block.children.reduce((childCount: number, child: any) => {
          return childCount + (child.text ? child.text.split(/\s+/).length : 0)
        }, 0)
      )
    }
    return count
  }, 0)
}
