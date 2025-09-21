import express from "express";
import axios from "axios";

const router = express.Router();

// 🔹 Helper: Get Access Token
async function getAccessToken() {
  const tokenUrl = "https://icdaccessmanagement.who.int/connect/token";
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  const response = await axios.post(tokenUrl, data);
  return response.data.access_token;
}

// 🔹 Step 1: Generate token (manual test)
router.post("/", async (req, res) => {
  try {
    const token = await getAccessToken();
    console.log("Token generated successfully!");
    res.status(200).json({ access_token: token });
  } catch (error) {
    console.error("Error generating token:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate access token." });
  }
});

// 🔹 Step 2: Search by term and fetch details
router.get("/:term", async (req, res) => {
  const { term } = req.params;

  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }
  console.log(`Searching term: ${term}`);

  try {

    const headers = {
      Accept: "application/json",
      "Accept-Language": "en",
      "API-Version": "v2",
      Authorization: `Bearer ${accessToken}`,
    };

    // 🔹 Search ICD
    const searchUrl = `https://id.who.int/icd/entity/search?q=${encodeURIComponent(term)}`;
    const searchResponse = await axios.get(searchUrl, { headers });
    const entities = searchResponse.data.destinationEntities || [];

    if (!entities.length) return res.json([]);

    const results = await Promise.allSettled(
      entities.map(async (entity) => {
        const entityId = entity.id.split("/").pop();
        const baseUrl = `https://id.who.int/icd/release/11/2025-01/mms/${entityId}`;

        const fetchDetails = async (url) => {
          const resp = await axios.get(url, { headers });
          return {
            code: resp.data.code,
            title: resp.data.title?.["@value"] || "",
            definition:resp.data.definition?.["@value"]||"",
            score: entity.score || 0  
          };
        };

        try {
          let details = await fetchDetails(baseUrl);
          // If code is empty, fallback to /unspecified
          if (!details.code) {
            details = await fetchDetails(`${baseUrl}/unspecified`);
          }
          return details;
        } catch (err) {
          console.warn(`Skipping entity ${entityId}:`, err.message);
          return null;
        }
      })
    );

    const validResults = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    res.json(validResults);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching ICD data" });
  }
});


export default router;
