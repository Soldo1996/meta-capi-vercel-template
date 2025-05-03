export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const accessToken = process.env.META_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  const { event_name, event_id, event_time, user_data, custom_data } = req.body;

  const payload = {
    data: [
      {
        event_name,
        event_time,
        event_id,
        user_data,
        custom_data,
        action_source: 'website'
      }
    ]
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );

  const result = await response.json();

  res.status(response.status).json(result);
}
