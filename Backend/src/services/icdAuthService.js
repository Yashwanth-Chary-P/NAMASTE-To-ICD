// src/services/icdAuthService.js
import axios from "axios";

// 🔹 Helper: Get Access Token from WHO ICD API
export const getAccessToken = async () => {
  try {
    const tokenUrl = "https://icdaccessmanagement.who.int/connect/token";
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "icdapi_access",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });
    const response = await axios.post(tokenUrl, data);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    throw new Error("Failed to get access token");
  }
};

// 🔹 Search ICD entities with detailed information
export const searchICDEntities = async (term, accessToken) => {
  try {
    const headers = {
      Accept: "application/json",
      "Accept-Language": "en",
      "API-Version": "v2",
      Authorization: `Bearer ${accessToken}`,
    };

    // Search for entities
    const searchUrl = `https://id.who.int/icd/entity/search?q=${encodeURIComponent(term)}`;
    const searchResponse = await axios.get(searchUrl, { headers });
    const entities = searchResponse.data.destinationEntities || [];

    if (!entities.length) return [];

    // Fetch detailed information for each entity
    const results = await Promise.allSettled(
      entities.map(async (entity) => {
        const entityId = entity.id.split("/").pop();
        const baseUrl = `https://id.who.int/icd/release/11/2025-01/mms/${entityId}`;

        const fetchDetails = async (url) => {
          const resp = await axios.get(url, { headers });
          return {
            code: resp.data.code,
            title: resp.data.title?.["@value"] || "",
            definition: resp.data.definition?.["@value"] || "",
            score: entity.score || 0,
            entityId: entityId
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

    return results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

  } catch (error) {
    console.error("Error searching ICD entities:", error.response?.data || error.message);
    throw new Error("Failed to search ICD entities");
  }
};
