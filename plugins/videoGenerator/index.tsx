import {PlayIcon} from '@sanity/icons'
import {useState} from 'react'
import {
  DocumentActionComponent,
  DocumentActionProps,
  useClient,
  useDocumentOperation,
} from 'sanity'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Spinner,
  Stack,
  Text,
  TextArea,
  TextInput,
  Select,
} from '@sanity/ui'

const generateVideoAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published} = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sceneType, setSceneType] = useState('opening')
  const [status, setStatus] = useState('')
  const client = useClient({apiVersion: '2024-01-01'})

  // Only show for novel documents
  if (type !== 'novel') {
    return null
  }

  const doc = draft || published

  const getDocumentId = () => {
    if (draft?._id) {
      return draft._id
    }
    if (published?._id) {
      return `drafts.${published._id}`
    }
    return id?.startsWith('drafts.') ? id : `drafts.${id}`
  }

  // Extract text from portable text blocks
  const extractTextFromContent = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return ''
    
    return content
      .filter((block: any) => block._type === 'block')
      .map((block: any) => {
        if (block.children) {
          return block.children
            .filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        }
        return ''
      })
      .join('\n')
      .substring(0, 2000) // Limit to first 2000 chars
  }

  // Generate scene prompt based on novel content and scene type
  const generateScenePrompt = (type: string): { title: string; prompt: string } => {
    if (!doc) return { title: 'Scene', prompt: '' }
    
    const title = (doc as any).title || 'Untitled Novel'
    const genre = (doc as any).genre || 'general'
    const description = (doc as any).description || ''
    const content = extractTextFromContent((doc as any).content || [])
    
    const genreStyles: Record<string, string> = {
      'fantasy': 'magical, ethereal lighting, fantasy world, mystical atmosphere',
      'sci-fi': 'futuristic, neon lights, high-tech environment, cyberpunk aesthetic',
      'romance': 'warm lighting, intimate atmosphere, soft focus, emotional mood',
      'mystery': 'dark shadows, noir style, suspenseful atmosphere, dramatic lighting',
      'thriller': 'intense, high contrast, fast-paced, tension-filled atmosphere',
      'horror': 'dark, eerie, unsettling atmosphere, shadows and mist',
      'literary': 'artistic, contemplative, beautiful cinematography, emotional depth',
    }
    
    const style = genreStyles[genre] || 'cinematic, high quality, dramatic lighting'
    
    const sceneConfigs: Record<string, { title: string; promptPrefix: string }> = {
      'opening': {
        title: 'Opening Scene',
        promptPrefix: 'The opening scene introducing the story:'
      },
      'climax': {
        title: 'Climax',
        promptPrefix: 'The dramatic climax of the story:'
      },
      'ending': {
        title: 'Ending Scene',
        promptPrefix: 'The emotional ending of the story:'
      },
      'key_moment': {
        title: 'Key Moment',
        promptPrefix: 'A pivotal moment in the story:'
      }
    }
    
    const config = sceneConfigs[type] || sceneConfigs['opening']
    
    // Build the prompt from novel content
    const prompt = `${config.promptPrefix} "${title}" - a ${genre} novel. 
${description ? `Story: ${description}` : ''}
${content ? `Context: ${content.substring(0, 500)}...` : ''}

Visual style: ${style}. 
8-second cinematic video, movie-quality, professional cinematography.`

    return { title: config.title, prompt }
  }

  const handleGenerate = async () => {
    const { title: sceneTitle, prompt: scenePrompt } = generateScenePrompt(sceneType)
    
    if (!scenePrompt.trim()) {
      setStatus('No novel content found. Please add content first.')
      return
    }

    setIsGenerating(true)
    setStatus('Generating video with Gemini Veo 2...')

    try {
      const { title: sceneTitle, prompt: scenePrompt } = generateScenePrompt(sceneType)
      const API_URL = (import.meta as any).env?.SANITY_STUDIO_VIDEO_API_URL || 'http://localhost:3000/api/generate-video'
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: scenePrompt,
          sceneTitle: sceneTitle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Video generation failed')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'No video generated')
      }

      setStatus('Video generated! Saving to document...')

      // Get current scenes or empty array
      const currentDoc = await client.fetch(`*[_id == $id][0]{ scenes }`, { id: getDocumentId() })
      const currentScenes = currentDoc?.scenes || []

      // Add new scene
      const newScene = {
        _key: Date.now().toString(),
        title: sceneTitle || 'Generated Scene',
        description: scenePrompt,
        videoUrl: data.videoUrl || `data:${data.mimeType};base64,${data.videoData}`,
        status: 'completed',
      }

      // Update document
      const documentId = getDocumentId()
      
      // Check if document exists
      const existingDoc = await client.fetch(`*[_id == $id][0]`, { id: documentId })
      
      if (!existingDoc) {
        await client.create({
          _id: documentId,
          _type: 'novel',
          title: (doc as any)?.title || 'Untitled',
          scenes: [newScene],
        })
      } else {
        await client.patch(documentId)
          .set({ scenes: [...currentScenes, newScene] })
          .commit()
      }

      setStatus('Video scene added successfully!')
      
      setTimeout(() => {
        setIsDialogOpen(false)
        setStatus('')
      }, 2000)

    } catch (error: any) {
      console.error('Video generation error:', error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const novelTitle = (doc as any)?.title || 'Untitled'
  const hasContent = (doc as any)?.content && (doc as any).content.length > 0

  return {
    label: 'Generate Video Scene',
    icon: PlayIcon,
    shortcut: 'Ctrl+Alt+V',
    onHandle: () => {
      setSceneType('opening')
      setStatus('')
      setIsDialogOpen(true)
    },
    dialog: isDialogOpen
      ? {
          type: 'dialog',
          onClose: () => setIsDialogOpen(false),
          content: (
            <Box padding={4}>
              <Stack space={4}>
                <Text size={2} weight="bold">
                  Generate AI Video Scene
                </Text>
                <Text size={1} muted>
                  Automatically generate an 8-second video from "{novelTitle}"
                </Text>

                {!hasContent && (
                  <Card padding={3} radius={2} tone="caution">
                    <Text size={1}>
                      This novel has no content yet. Please generate or add content first.
                    </Text>
                  </Card>
                )}

                <Stack space={2}>
                  <Text size={1} weight="semibold">Select Scene Type</Text>
                  <select
                    value={sceneType}
                    onChange={(e) => setSceneType(e.target.value)}
                    disabled={isGenerating}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                    }}
                  >
                    <option value="opening">Opening Scene - Story introduction</option>
                    <option value="climax">Climax - Dramatic peak moment</option>
                    <option value="ending">Ending Scene - Story conclusion</option>
                    <option value="key_moment">Key Moment - Pivotal scene</option>
                  </select>
                </Stack>

                <Card padding={3} radius={2} tone="primary" style={{ background: '#f0f4ff' }}>
                  <Text size={1}>
                    The video will be automatically generated based on:
                    <br />• Novel title: {novelTitle}
                    <br />• Genre: {(doc as any)?.genre || 'general'}
                    <br />• Story content
                  </Text>
                </Card>

                {status && (
                  <Card padding={3} radius={2} tone={status.includes('Error') ? 'critical' : 'positive'}>
                    <Flex align="center" gap={2}>
                      {isGenerating && <Spinner />}
                      <Text size={1}>{status}</Text>
                    </Flex>
                  </Card>
                )}

                <Flex gap={2} justify="flex-end">
                  <Button
                    mode="ghost"
                    text="Cancel"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isGenerating}
                  />
                  <Button
                    tone="primary"
                    text={isGenerating ? 'Generating...' : 'Generate Video'}
                    onClick={handleGenerate}
                    disabled={isGenerating || !hasContent}
                    icon={isGenerating ? Spinner : PlayIcon}
                  />
                </Flex>
              </Stack>
            </Box>
          ),
        }
      : null,
  }
}

export default generateVideoAction
