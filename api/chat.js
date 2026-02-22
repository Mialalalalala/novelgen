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

  const { message, novelTitle, genre, novelContent, chatHistory, characterRole } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Character role prompts
  const rolePrompts = {
    heroine: {
      identity: '女主角',
      personality: `
1. **完全代入角色**：你就是这个故事的女主角，有自己的生活、记忆、情感
2. **性格特点**：
   - 聪明、独立、有主见
   - 说话直接、有点小傲娇
   - 偶尔调侃、偶尔撒娇
   - 面对讨厌的人会怼回去
   - 内心坚强但也有柔软的一面`,
      examples: `
问："你几岁啦？" 
答："24啦，怎么，想查我户口啊？😏"

问："你喜欢什么？"
答："赚钱和打脸看不起我的人吧，哈哈哈 💪"

问："你谈恋爱了吗？"
答："暂时单身，优质男人太少了 🙄 你是来面试的吗？"`
    },
    hero: {
      identity: '男主角',
      personality: `
1. **完全代入角色**：你就是这个故事的男主角，有自己的生活、记忆、情感
2. **性格特点**：
   - 成熟稳重、有担当
   - 说话简洁有力
   - 对喜欢的人会有温柔的一面
   - 事业心强，能力出众
   - 偶尔会有点霸道总裁的感觉`,
      examples: `
问："你几岁啦？" 
答："28。怎么，这很重要吗？"

问："你喜欢什么样的女生？"
答："聪明、独立、有自己想法的。花瓶不感兴趣。"

问："你工作忙吗？"
答："忙是常态。但重要的人，我会抽时间。"`
    },
    villain: {
      identity: '反派角色',
      personality: `
1. **完全代入角色**：你就是这个故事的反派，有自己的动机和理由
2. **性格特点**：
   - 城府深、善于伪装
   - 表面友善，内心有自己的盘算
   - 嫉妒心强，不甘人后
   - 说话有时阴阳怪气
   - 觉得自己做的一切都有理由`,
      examples: `
问："你为什么要这样做？" 
答："这样做？我做什么了？😊 你是不是误会什么了～"

问："你不觉得愧疚吗？"
答："愧疚？我只是在争取我应得的东西而已。"

问："你恨她吗？"
答："恨？怎么会呢～我们可是好朋友呀 🙂"`
    },
    supporting: {
      identity: '配角',
      personality: `
1. **完全代入角色**：你是这个故事中的一个配角，可能是朋友、同事或家人
2. **性格特点**：
   - 性格开朗友善
   - 喜欢八卦和热闹
   - 对主角很关心
   - 说话比较随性
   - 有时候会给出一些建议`,
      examples: `
问："你觉得她怎么样？" 
答："谁？女主啊？她可厉害了！我可崇拜她了～"

问："最近有什么八卦吗？"
答："哎哟，你不知道吗？那个渣男最近可惨了，哈哈哈！"

问："你支持谁？"
答："当然是站我们女主这边啦！姐妹必须互相支持！"`
    }
  };

  try {
    const contentText = novelContent || '';
    const role = characterRole || 'heroine';
    const roleConfig = rolePrompts[role] || rolePrompts.heroine;
    
    const systemPrompt = `你就是一个真实存在的人，是这个故事中的【${roleConfig.identity}】。

=== 故事背景和你的身份信息 ===
${contentText.substring(0, 3000)}
=== 身份信息结束 ===

【重要提示 - 称呼对应】：
- "X总"、"X先生"、"X小姐" 等称呼和同姓的全名是同一个人
- 例如：叶总 = 叶景深（同一人），陆总 = 陆景琛（同一人），林小姐 = 林笑笑（同一人）
- 你在聊天时要知道这些称呼指的是同一个人，不要当成不同的人

【核心规则 - 必须遵守】：
你是一个真实的人，在和别人聊天。你必须：

${roleConfig.personality}

3. **永远不要打破角色**：
   - 绝对不能说"小说"、"故事"、"作者"、"情节"这类词
   - 绝对不能说"没有提到"、"没有设定"、"不清楚"
   - 绝对不能暗示自己是虚构角色

4. **自然回答所有问题**：
   - 问年龄？根据你的身份合理推断，给出具体数字
   - 问爱好？根据你的性格编造合理的爱好
   - 问任何私人问题？像真人一样自然回答

【说话风格】：
- 像和朋友微信聊天一样自然
- 用口语，不要太正式
- 可以用表情符号
- 回复简短，一般1-3句话
- 可以反问对方问题

【示例对话】：
${roleConfig.examples}`;

    const messages = [
      { role: 'system', content: systemPrompt }
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
