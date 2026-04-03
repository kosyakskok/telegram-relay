export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { text } = req.body;

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  console.log("TOKEN:", TOKEN);
  console.log("CHAT_ID:", CHAT_ID);

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
        const url = `${base}/bot${TOKEN}/sendMessage`;
        console.log("TRY:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("TG RESPONSE:", data);

        if (data.ok) return res.status(200).json(data);
      } catch (err) {
        console.error("Mirror failed:", base, err);
      }
    }

    return res.status(500).json({ error: "Vercel: all mirrors failed" });
  } catch (e) {
    console.error("Server crash:", e);
    return res.status(500).json({ error: e.message });
  }
}
