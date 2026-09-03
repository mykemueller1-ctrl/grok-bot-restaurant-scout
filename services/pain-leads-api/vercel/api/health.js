module.exports = (req, res) => {
  res.setHeader("content-type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, service: "never86-pain-leads-api", mode: "vercel", ts: Date.now() }));
};
