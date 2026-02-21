import {definePlugin} from 'sanity'
import generateVideoAction from './index'

export const videoGenerator = definePlugin({
  name: 'video-generator',
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'novel') {
        return [...prev, generateVideoAction]
      }
      return prev
    },
  },
})
