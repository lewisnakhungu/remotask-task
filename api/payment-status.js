export default async function handler(req, res) {
  const { reference } = req.query;

  if (!reference) return res.status(400).json({ error: 'Reference is required' });

  const payHeroStatusUrl = `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${reference}`;
  const auth = process.env.PAYHERO_BASIC_AUTH || process.env.VITE_PAYHERO_AUTH;

  try {
    const response = await fetch(payHeroStatusUrl, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    // Normalize PayHero status string
    const statusMap = {
      'SUCCESS': 'success',
      'FAILED': 'failed',
      'CANCELLED': 'failed',
      'PENDING': 'pending',
    };

    const status = statusMap[data.status] || 'pending';
    return res.status(200).json({ status, raw: data.status, full: data });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
