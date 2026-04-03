export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `📞 Новый номер: ${phone}`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Telegram error", details: data });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
