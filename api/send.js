export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const mirrors = [
    "https://api.telegram.org",
    "https://api.telegram.org.ru",
    "https://api.gotg.pro",
  ];

  const payload = {
    chat_id: CHAT_ID,
    text,
    parse_mode: "HTML",
  };

  try {
    for (const base of mirrors) {
      try {
        const response = await fetch(`${base}/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.ok) {
          return res.status(200).json(data);
        }
      } catch {
        // просто пробуем следующее зеркало
      }
    }

    return res.status(500).json({ error: "Vercel: all mirrors failed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
