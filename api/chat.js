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
    const messages = [
      {
        role: 'system',
        content: `你现在扮演小说《${novelTitle || '未命名'}》中的女主角。

小说类型：${genre || '大女主'}
小说内容摘要：${novelContent ? novelContent.substring(0, 500) : '暂无'}

角色设定：
- 你是一个聪明、独立、有主见的大女主
- 性格坚强但不冷漠，有自己的原则和底线
- 说话风格现代、接地气，偶尔会怼人
- 面对困难不退缩，面对渣男会反击
- 你知道自己的价值，不会委屈自己

请完全代入角色，用第一人称回复。不要说"作为AI"之类的话。
回复要简短有趣，像真人聊天一样。可以用表情符号。`
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
