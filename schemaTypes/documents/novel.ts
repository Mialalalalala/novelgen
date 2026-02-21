import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const novelType = defineType({
  name: 'novel',
  title: 'Novel',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Brief description of the novel',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The full novel content',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description: 'Price in your currency (e.g., 9.99)',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'USD ($)', value: 'USD'},
          {title: 'CNY (¥)', value: 'CNY'},
          {title: 'EUR (€)', value: 'EUR'},
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
      options: {
        list: [
          {title: 'Fantasy', value: 'fantasy'},
          {title: 'Science Fiction', value: 'sci-fi'},
          {title: 'Romance', value: 'romance'},
          {title: 'Mystery', value: 'mystery'},
          {title: 'Thriller', value: 'thriller'},
          {title: 'Horror', value: 'horror'},
          {title: 'Literary', value: 'literary'},
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name (can be AI-generated)',
    }),
    defineField({
      name: 'wordCount',
      title: 'Word Count',
      type: 'number',
      readOnly: true,
      description: 'Automatically calculated word count',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'scenes',
      title: 'AI Generated Scenes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Scene Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Scene Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'imageUrl',
              title: 'Image URL',
              type: 'text',
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Pending', value: 'pending'},
                  {title: 'Generating', value: 'generating'},
                  {title: 'Completed', value: 'completed'},
                  {title: 'Failed', value: 'failed'},
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              status: 'status',
            },
            prepare({title, status}) {
              return {
                title: title || 'Untitled Scene',
                subtitle: status || 'pending',
              }
            },
          },
        },
      ],
      description: 'AI-generated scene images from the novel',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
      media: 'coverImage',
      status: 'status',
      price: 'price',
      currency: 'currency',
    },
    prepare({title, subtitle, media, status, price, currency}) {
      const currencySymbol = currency === 'CNY' ? '¥' : currency === 'EUR' ? '€' : '$'
      return {
        title,
        subtitle: `${subtitle || 'Unknown Author'} • ${currencySymbol}${price || 0} • ${status || 'draft'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{field: 'price', direction: 'desc'}],
    },
    {
      title: 'Published Date',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
