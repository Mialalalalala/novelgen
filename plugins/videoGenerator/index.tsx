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
} from '@sanity/ui'

const generateVideoAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published} = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [scenePrompt, setScenePrompt] = useState('')
  const [sceneTitle, setSceneTitle] = useState('')
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

  const generateScenePrompt = () => {
    if (!doc) return ''
    
    const title = (doc as any).title || 'Untitled Novel'
    const genre = (doc as any).genre || 'general'
    const description = (doc as any).description || ''
    
    return `A cinematic scene from "${title}", a ${genre} novel. ${description}. High quality, dramatic lighting, movie-like cinematography.`
  }

  const handleGenerate = async () => {
    if (!scenePrompt.trim()) {
      setStatus('Please enter a scene description')
      return
    }

    setIsGenerating(true)
    setStatus('Generating video with Gemini Veo 2...')

    try {
      const API_URL = (import.meta as any).env?.SANITY_STUDIO_VIDEO_API_URL || 'http://localhost:3000/api/generate-video'
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: scenePrompt,
          sceneTitle: sceneTitle || 'Scene',
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
      setScenePrompt('')
      setSceneTitle('')
      
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

  return {
    label: 'Generate Video Scene',
    icon: PlayIcon,
    shortcut: 'Ctrl+Alt+V',
    onHandle: () => {
      setScenePrompt(generateScenePrompt())
      setSceneTitle('')
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
                  Use Gemini Veo 2 to generate an 8-second video scene from your novel
                </Text>

                <Stack space={2}>
                  <Text size={1} weight="semibold">Scene Title</Text>
                  <TextInput
                    value={sceneTitle}
                    onChange={(e) => setSceneTitle(e.currentTarget.value)}
                    placeholder="e.g., Opening Scene, Climax, Ending..."
                    disabled={isGenerating}
                  />
                </Stack>

                <Stack space={2}>
                  <Text size={1} weight="semibold">Scene Description (Prompt)</Text>
                  <TextArea
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.currentTarget.value)}
                    rows={5}
                    placeholder="Describe the scene you want to generate..."
                    disabled={isGenerating}
                  />
                </Stack>

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
                    disabled={isGenerating || !scenePrompt.trim()}
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
