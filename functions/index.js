const functions = require("firebase-functions");
const axios = require("axios");

exports.apiProxy = functions.https.onRequest(async (req, res) => {
  // Add CORS headers to the response
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Extract the path and query (e.g., /api/home)
  // req.url contains the path after the function trigger
  const targetUrl = `https://animesalt-api-lovat.vercel.app${req.url}`;

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        "User-Agent": req.headers["user-agent"],
        "Accept": req.headers["accept"],
      },
      timeout: 10000
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message,
      error: error.response?.data
    });
  }
});
