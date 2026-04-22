import {
  getAccessToken,
  searchICDEntities,
} from "../services/icdAuthService.js";

// 🔐 Token Controller
export const generateToken = async (req, res) => {
  try {
    const token = await getAccessToken();

    res.status(200).json({
      access_token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔍 Search Controller
export const searchICD = async (req, res) => {
  const { term } = req.params;

  try {
    // get token internally (better UX)
    const token = await getAccessToken();

    const results = await searchICDEntities(term, token);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};