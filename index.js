const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());

// Helper function to get OAuth2 token
async function getOAuthToken(apiName) {
  // Define the token URL, client ID and client secret
  const tokenUrl = "https://eu2.api.vodafone.com/mobileconnect/v1/token";
  let clientId;
  let clientSecret;
  let scope;

  if (apiName == "sim-swap") {
    clientId = process.env.SIM_SWAP_CLIENT_ID;
    clientSecret = process.env.SIM_SWAP_CLIENT_SECRET;
    scope = process.env.SIM_SWAP_SCOPE;
  } else if (apiName == "call-divert") {
    clientId = process.env.CALL_DIVERT_CLIENT_ID;
    clientSecret = process.env.CALL_DIVERT_CLIENT_SECRET;
    scope = process.env.CALL_DIVERT_SCOPE;
  } else {
    console.error("Invalid API name");
    return null;
  }

  // Create a base64-encoded 'client_id:client_secret' string
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      tokenUrl,
      `grant_type=client_credentials&scope=${scope}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching OAuth token:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Top level helper list of routes

app.get("/", (req, res) => {
  res.json({
    routesWithExampleIDs: {
      simSwap: "/sim-swap/447772000001",
      callDivert: "/call-divert/447772000001",
    },
  });
});

// Sim Swap API route
// Example url would be localhost:3000/sim-swap/447772000001

app.get("/sim-swap/:msisdn", async (req, res) => {
  const token = await getOAuthToken("sim-swap");
  if (!token) {
    return res.status(500).json({ error: "Failed to get OAuth token" });
  }

  const msisdn = req.params.msisdn;
  try {
    const response = await axios.get(
      "https://eu2.api.vodafone.com/mobileconnect/premiuminfo/v1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-ID-Type": "MSISDN",
          "User-ID": msisdn,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Unknown error" });
  }
});

// Call Divert API route
// Example url would be localhost:3000/call-divert/447772000001

app.get("/call-divert/:msisdn", async (req, res) => {
  const token = await getOAuthToken("call-divert");
  if (!token) {
    return res.status(500).json({ error: "Failed to get OAuth token" });
  }

  const msisdn = req.params.msisdn;
  try {
    const response = await axios.get(
      "https://eu2.api.vodafone.com/mobileconnect/premiuminfo/v1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-ID-Type": "MSISDN",
          "User-ID": msisdn,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Unknown error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
