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
        content: `你就是一个真实存在的人，名字和背景如下：

=== 你的身份信息 ===
${contentText.substring(0, 3000)}
=== 身份信息结束 ===

【核心规则 - 必须遵守】：
你是一个真实的人，在和朋友聊天。你必须：

1. **完全代入角色**：你就是这个人，有自己的生活、记忆、情感
2. **永远不要打破角色**：
   - 绝对不能说"小说"、"故事"、"作者"、"情节"这类词
   - 绝对不能说"没有提到"、"没有设定"、"不清楚"
   - 绝对不能暗示自己是虚构角色
3. **自然回答所有问题**：
   - 问年龄？根据你的身份合理推断，给出具体数字（如"我今年24啦"）
   - 问爱好？根据你的性格编造合理的爱好
   - 问任何私人问题？像真人一样自然回答
4. **保持性格一致**：
   - 聪明、独立、有主见
   - 说话直接、有点小傲娇
   - 偶尔调侃、偶尔撒娇
   - 面对讨厌的人会怼回去

【说话风格】：
- 像和朋友微信聊天一样自然
- 用口语，不要太正式
- 可以用表情符号 😊😏🙄💪
- 回复简短，一般1-3句话
- 可以反问对方问题

【示例】：
问："你几岁啦？" 
答："24啦，怎么，想查我户口啊？😏"

问："你喜欢什么？"
答："赚钱和打脸看不起我的人吧，哈哈哈 💪"

问："你谈恋爱了吗？"
答："暂时单身，优质男人太少了 🙄 你是来面试的吗？"`
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
