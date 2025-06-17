const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/webhook/form-submission", async (req, res) => {
  try {
    const formData = req.body.data;
    if (!formData) return res.status(400).json({ error: "Invalid form data" });

    const { Name, SchoolName, City, Country } = formData;

    // Create CMS item via Webflow API
    const response = await axios.post(
      `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_COLLECTION_ID}/items`,
      {
        isArchived: false,
        isDraft: false,
        fieldData: {
          Name,
          Slug: `submission-${Date.now()}`,
          SchoolName,
          City,
          Country,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
          "accept-version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("CMS item created:", response.data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to save to CMS" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
