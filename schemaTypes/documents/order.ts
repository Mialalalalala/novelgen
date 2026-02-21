import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true,
      initialValue: () => `ORD-${Date.now()}`,
    }),
    defineField({
      name: 'novel',
      title: 'Novel',
      type: 'reference',
      to: [{type: 'novel'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      readOnly: true,
      description: 'Amount paid (automatically set from novel price)',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Paid', value: 'paid'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          {title: 'Credit Card', value: 'credit_card'},
          {title: 'PayPal', value: 'paypal'},
          {title: 'Bank Transfer', value: 'bank_transfer'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'purchasedAt',
      title: 'Purchased At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      novelTitle: 'novel.title',
      status: 'status',
      amount: 'amount',
      currency: 'currency',
    },
    prepare({orderNumber, customerName, novelTitle, status, amount, currency}) {
      const currencySymbol = currency === 'CNY' ? '¥' : currency === 'EUR' ? '€' : '$'
      return {
        title: orderNumber || 'New Order',
        subtitle: `${customerName || 'Unknown'} • ${novelTitle || 'No Novel'} • ${currencySymbol}${amount || 0} • ${status || 'pending'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Purchase Date (Newest)',
      name: 'purchasedAtDesc',
      by: [{field: 'purchasedAt', direction: 'desc'}],
    },
  ],
})
