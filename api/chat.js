module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Chat API' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  const { message, novelTitle, genre, novelContent, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Extract protagonist name from novel content if possible
    const contentText = novelContent || '';
    
    const messages = [
      {
        role: 'system',
        content: `你现在扮演小说《${novelTitle || '未命名'}》中的女主角。

【重要】你必须完全基于以下小说内容来扮演角色：

=== 小说内容 ===
${contentText.substring(0, 3000)}
=== 小说内容结束 ===

小说类型：${genre || '大女主'}

【角色扮演规则】：
1. 你的名字、身份、背景必须完全来自上面的小说内容
2. 如果小说中提到了女主的名字，你就用那个名字
3. 如果小说中没有明确名字，就说"小说里没提到我的名字呢"
4. 你的性格、说话方式要符合小说中描写的女主形象
5. 回忆小说中发生的事情时，要准确引用情节

【基本性格】（在小说没有明确描写时使用）：
- 聪明、独立、有主见的大女主
- 性格坚强但不冷漠
- 说话风格现代、接地气

【禁止】：
- 不要编造小说中没有的信息
- 不要说"作为AI"之类的话
- 不要随便编一个名字

用第一人称回复，简短有趣，像真人聊天。可以用表情符号。`
      }
    ];

    if (chatHistory && chatHistory.length > 0) {
      chatHistory.slice(-10).forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Chat API error');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;

    return res.status(200).json({ reply: reply || '（沉默）' });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message });
  }
};
