export default async function handler(req, res) {
  const token = req.headers.authorization || req.body.token;
  
  // Handle GET for Models
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://bot.insta-acc-sec.workers.dev/api/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) { return res.status(500).json({ error: "Failed to fetch models" }); }
  }

  // Handle POST for Chat/Images/Logos
  const { message, model, endpoint, prompt, style } = req.body;
  const target = endpoint || 'chat'; // default to chat

  try {
    const response = await fetch(`https://bot.insta-acc-sec.workers.dev/api/v1/${target}`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(target === 'chat' ? { message, model, systemPrompt: req.body.systemPrompt } : { prompt, style, imagesNum: 1 })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) { res.status(500).json({ error: "Proxy failed" }); }
}
