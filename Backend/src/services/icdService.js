// src/services/icdService.js
import fetch from "node-fetch";
import { getAccessToken, searchICDEntities } from "./icdAuthService.js";

// Single method - OAuth authentication with detailed entity search
export const fetchICDDataAdvanced = async (query) => {
  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Search entities with detailed information
    const entities = await searchICDEntities(query, accessToken);

    if (!entities.length) {
      return null;
    }

    // Use first result (most relevant)
    const firstEntity = entities[0];
    return {
      query: query.toLowerCase(),
      icd_code: firstEntity.code,
      title: firstEntity.title,
      definition: firstEntity.definition,
      raw_response: { entities: entities },
    };
  } catch (err) {
    console.error("Advanced ICD API Error:", err.message);
    return null;
  }
};
