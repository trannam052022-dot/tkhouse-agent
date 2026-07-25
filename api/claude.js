export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const adminKey = process.env.ADMIN_KEY;
  if (adminKey && req.headers['x-admin-key'] !== adminKey) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  const { prompt, system, messages } = req.body;
  const chatMessages = Array.isArray(messages) && messages.length
    ? messages
    : [{ role: 'user', content: prompt }];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: system || '',
      messages: chatMessages
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
