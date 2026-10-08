import axios from "axios";
import instruction from "./systemInst.js";

let responseHistory = [];
async function geminiCall(query, topk) {
  responseHistory.push({role:"user", parts:[{text:query}]});
  const chunks = topk.map((data) => data.chunk).join("\n\n");
  const finalInstruction = instruction.replace("{{context}}", chunks);
  try {
    const response=await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        systemInstruction: {
          parts: [
            {
              text: finalInstruction,
            },
          ],
        },
        contents: responseHistory,
      },
      {
        headers: {
          "x-goog-api-key": process.env.GOOGLE_API_KEY,
        },
      },
    );

    const answer = response.data.candidates[0].content.parts[0].text;

    // 5. Model ka answer bhi history mein daalo, taaki follow-up questions chalein
    responseHistory.push({ role: "model", parts: [{ text: answer }] });

    return answer;
  } catch (err) {
    console.log(err.message);
  }
};

export default geminiCall;