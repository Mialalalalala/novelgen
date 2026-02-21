module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Novel Continuation API' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  const { novelTitle, genre, novelContent, direction } = req.body;
  if (!novelContent) {
    return res.status(400).json({ error: 'Novel content is required' });
  }
  if (!direction) {
    return res.status(400).json({ error: 'Please specify what story direction you want' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `你是一位专业的网络小说作家，擅长创作大女主风格的小说。

你的任务是续写小说，要求：
1. 完美衔接前文的情节和人物
2. 保持相同的写作风格和语气
3. 继续发展故事，推动剧情
4. 保持女主的独立、聪明、有主见的人设
5. 加入适当的爽点、打脸、逆袭情节
6. 续写内容约500-800字

格式要求：
- 用中文写作
- 段落之间用空行分隔
- 对话用引号标注
- 不要写"续写："之类的开头，直接接着写故事`
          },
          {
            role: 'user',
            content: `请根据用户的要求续写以下小说：

小说标题：《${novelTitle || '未命名'}》
小说类型：${genre || '大女主'}

=== 已有内容 ===
${novelContent.substring(-3000)}
=== 已有内容结束 ===

【用户想看的剧情】：${direction}

请根据用户的要求，续写故事内容。必须：
1. 衔接前文
2. 实现用户想要的剧情发展
3. 写得精彩、有爽点

直接开始写故事，不要说"好的"之类的开场白：`
          }
        ],
        max_tokens: 1500,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const continuation = data.choices[0]?.message?.content;

    if (!continuation) {
      throw new Error('No content generated');
    }

    return res.status(200).json({ 
      success: true,
      continuation: continuation.trim()
    });
  } catch (error) {
    console.error('Novel continuation error:', error);
    return res.status(500).json({ error: error.message });
  }
};
