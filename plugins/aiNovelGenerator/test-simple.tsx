/**
 * Simple test version to verify the plugin is working
 * If this shows up, the plugin system is working
 */

import {BookIcon} from '@sanity/icons'
import {type DocumentActionDescription} from 'sanity'

export default (props: any): DocumentActionDescription | undefined => {
  const {type} = props

  // Only show for novel documents
  if (type !== 'novel') {
    return undefined
  }

  // Simple test action
  return {
    label: 'Generate with AI (Test)',
    icon: BookIcon,
    onHandle: () => {
      alert('Plugin is working! This is a test action.')
    },
  }
}
