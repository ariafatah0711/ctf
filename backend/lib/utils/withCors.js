export function withCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Tangani preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
