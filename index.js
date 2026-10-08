import "dotenv/config";
import express from "express";
import createEmbedding from "./utils/model.js";
import searchSimilarchunks from "./controller/Similarchunk.js";
import getRun from "./utils/pdfReader.js";
import geminiCall from "./utils/promptmodel.js";
import upload from "./middleware/uploads.js";
const app = express();

app.use(express.json());

app.post("/chat/model", async (req, res) => {
  try {
    const { query } = req.body;

    const queryEmbedded = await createEmbedding(query);
    const relevantChunks = await searchSimilarchunks(queryEmbedded);
    const response = await geminiCall(query, relevantChunks);

    res.status(200).json({
      response,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);

    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: "File is required...",
      });
    }

    console.log("uploaded:", req.file.path);
    await getRun(req.file.path);
    res.status(200).json({
      message: "PDF uploaded and processed successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
});

async function InitializeConnection() {
  try {
    app.listen(3000, () => {
      console.log("Server started at port:3000");
    });
  } catch (err) {
    console.log(err.message);
  }
};

InitializeConnection();
