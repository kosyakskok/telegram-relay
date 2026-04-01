export default async function handler(req, res) {
  // CORS для Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Missing Telegram credentials" });
  }

  let text;

  try {
    // Vercel НЕ парсит body автоматически — нужно вручную
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    text = body.text;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const url = `https://telegg.ru/orig/bot${token}/sendMessage`;

    const tgResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await tgResponse.json().catch(() => null);

    if (!data || !data.ok) {
      return res.status(500).json({
        error: "Telegram error",
        details: data || "No response",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
