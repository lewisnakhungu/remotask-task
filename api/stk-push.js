import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, phone_number, customer_name, external_reference } = req.body;

  // Format phone number to 254... standard
  let cleanPhone = phone_number.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.substring(1);
  else if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
  if (!cleanPhone.startsWith('254')) cleanPhone = '254' + cleanPhone;

  const payHeroUrl = 'https://backend.payhero.co.ke/api/v2/payments';
  // Use env variables
  const auth = process.env.PAYHERO_BASIC_AUTH || process.env.VITE_PAYHERO_AUTH;
  const channelId = process.env.PAYHERO_CHANNEL_ID || process.env.VITE_PAYHERO_CHANNEL_ID;

  try {
    const response = await fetch(payHeroUrl, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        phone_number: cleanPhone,
        channel_id: parseInt(channelId),
        provider: "m-pesa",
        external_reference: external_reference || `INV-${Date.now()}`,
        customer_name: customer_name || "Customer",
        callback_url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'your-fallback.vercel.app'}/api/callback`
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
