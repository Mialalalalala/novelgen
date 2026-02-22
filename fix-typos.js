const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '9cp0f5xw',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN
})

async function fixTypos() {
  const novelId = 'c4f16e02-2f0c-4d61-8082-4931dc13eb08'
  
  // Get the current document
  const novel = await client.getDocument(novelId)
  
  if (!novel) {
    console.log('Novel not found')
    return
  }
  
  console.log('Found novel:', novel.title)
  
  // Fix the typos in content
  const fixedContent = novel.content.map(block => {
    if (block._type === 'block' && block.children) {
      return {
        ...block,
        children: block.children.map(child => {
          if (child._type === 'span' && child.text) {
            let fixedText = child.text
            // Fix typos
            fixedText = fixedText.replace('泊面', '泡面')
            fixedText = fixedText.replace('手一顺', '手一抖')
            fixedText = fixedText.replace('她挚着一个大肉球，眼笑不笑', '她挺着大肚子，似笑非笑')
            fixedText = fixedText.replace('撞着', '靠着')
            fixedText = fixedText.replace('娇嫡', '娇滴滴')
            fixedText = fixedText.replace('眉头微绉', '眉头微皱')
            fixedText = fixedText.replace('眼眖', '眼眸')
            fixedText = fixedText.replace('俄罗斯贵族在绅士', '英俊的绅士')
            return { ...child, text: fixedText }
          }
          return child
        })
      }
    }
    return block
  })
  
  // Update the document
  const result = await client
    .patch(novelId)
    .set({ content: fixedContent })
    .commit()
  
  console.log('Fixed typos successfully!')
  console.log('Updated document:', result._id)
}

fixTypos().catch(console.error)
