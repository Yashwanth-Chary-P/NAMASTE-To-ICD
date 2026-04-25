const axios = require("axios");

async function proxyMapRequest(payload) {
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  if (!mlServiceUrl) {
    const err = new Error("ML_SERVICE_URL is missing in environment variables");
    err.statusCode = 500;
    throw err;
  }

  try {
    const response = await axios.post(`${mlServiceUrl}/map`, payload, {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    const err = new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Failed to reach ML service"
    );
    err.statusCode = error.response?.status || 502;
    throw err;
  }
}

module.exports = {
  proxyMapRequest
};