export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text } = req.body;

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const mirrors = [
      "https://api.telegram.org",
      "https://api.telegram.org.ru",
      "https://api.gotg.pro",
    ];

    for (const base of mirrors) {
      try {
        const r = await fetch(`${base}/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        });

        const data = await r.json();

        if (data.ok) {
          return res.status(200).json(data);
        }
      } catch (e) {
        // пробуем следующий
      }
    }

    return res.status(500).json({ error: "Vercel: all mirrors failed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
