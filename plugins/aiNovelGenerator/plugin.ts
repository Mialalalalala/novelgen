import {definePlugin} from 'sanity'
import generateNovelAction from './index'

export const aiNovelGenerator = definePlugin({
  name: 'ai-novel-generator',
  document: {
    actions: (prev, context) => {
      // Add the generate action for novel documents
      if (context.schemaType === 'novel') {
        return [...prev, generateNovelAction]
      }
      return prev
    },
  },
})
