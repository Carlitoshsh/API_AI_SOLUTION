import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import schema from "../scheme/ia/cv.js";

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

async function getDocumentData(promp) {
  const result = await model.generateContent([promp]);
  return result.response;
}

async function getRecommendation(prompt, cvsResults) {
  try {
    const evaluationPrompt = `${prompt} You are a CV system. Based on the CVs provided, evaluate each CV and suggest the most suitable candidate. If no candidate is found, recommend the most qualifying person who could learn the required skill.`;

    const result = await model.generateContent([
      evaluationPrompt,
      ...cvsResults,
    ]);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return null;
  }
}

async function analyzePdf(pdfFilePath) {
  try {
    const prompt =
      "Summarize the following CV. Identify and list the top 10 skills—categorized into soft skills and technical skills—from the information provided. Ensure each skill is clearly described and prioritized based on relevance and proficiency.";
    const pdfBuffer = fs.readFileSync(pdfFilePath);
    const pdfBase64 = pdfBuffer.toString("base64");

    const imageParts = [
      {
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    return null;
  }
}

const methods = {
  getDocumentData,
  analyzePdf,
  getRecommendation,
};

export default methods;
