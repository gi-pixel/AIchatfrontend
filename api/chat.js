// api/chat.js
export default async function handler(req, res) {
  const { message, model, token } = req.body;

  try {
    const response = await fetch('https://bot.insta-acc-sec.workers.dev/api/v1/chat', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          message: message,
          model: model || "gpt_5_3",
          systemPrompt: "You are a helpful assistant."
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed to reach AI server" });
  }
}
