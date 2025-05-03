export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  const payload = {
    data: [
      {
        event_name: req.body.event_name,
        event_time: req.body.event_time,
        event_id: req.body.event_id,
        user_data: req.body.user_data,
        custom_data: req.body.custom_data,
        action_source: 'website'
      }
    ]
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    console.error('CAPI error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
