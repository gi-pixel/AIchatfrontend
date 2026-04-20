export const config = {
  runtime: 'edge', // Crucial for streaming
};

export default async function handler(req) {
  if (req.method === 'GET') {
    const token = req.headers.get('authorization');
    const res = await fetch('https://bot.insta-acc-sec.workers.dev/api/models', {
      headers: { 'Authorization': token }
    });
    return new Response(res.body, { headers: { 'Content-Type': 'application/json' } });
  }

  const { message, model, endpoint, prompt, style, token, systemPrompt } = await req.json();
  const target = endpoint || 'chat';

  try {
    const response = await fetch(`https://bot.insta-acc-sec.workers.dev/api/v1/${target}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        target === 'chat' 
        ? { message, model, systemPrompt, stream: true } // Requesting the stream
        : { prompt, style, imagesNum: 1 }
      ),
    });

    // If it's an image, just return the JSON normally
    if (target.includes('image')) {
      const data = await response.json();
      return new Response(JSON.stringify(data));
    }

    // For chat, pipe the stream directly to the frontend
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Streaming Proxy Failed" }), { status: 500 });
  }
}
