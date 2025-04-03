import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import schema from "../scheme/ia/cv.js";
import recommendedPersonSchema from "../scheme/ia/recommendation.js";
import bestMatchJobSchema from "../scheme/ia/jobMatch.js";

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

const setSchema = (_sch) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: _sch,
    },
  });
};

const cvModel = setSchema(schema);
const recommendationModel = setSchema(recommendedPersonSchema);
const matchJobModel = setSchema(bestMatchJobSchema)

async function getDocumentData(promp) {
  const result = await cvModel.generateContent([promp]);
  return result.response;
}

async function getRecommendation(prompt, cvsResults) {
  try {
    const evaluationPrompt = `You are a CV system. Based on the CVs provided, evaluate each CV and suggest the most suitable candidate for the following job requirements: "${prompt}". If no perfect candidate is found, recommend the most qualifying person who possesses some of the required skills and demonstrates the ability to quickly learn the remaining skills.`;
    const formattedResults = cvsResults.map((cv) => JSON.stringify(cv));

    const result = await recommendationModel.generateContent([
      evaluationPrompt,
      ...formattedResults,
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

    const result = await cvModel.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    return null;
  }
}

async function getJobMatch(prompt, jobs) {
  try {
    const evaluationPrompt = `You are a job system in a Consulting company. Based on the jobs provided, evaluate each job and suggest the most suitable client for the following job requirements: "${prompt}". If no perfect client is found, recommend the most nearly client who possesses some of the required skills and demonstrates the ability to adapt the remaining skills.`;
    const formattedResults = jobs.map((job) => JSON.stringify(job));

    const result = await matchJobModel.generateContent([
      evaluationPrompt,
      ...formattedResults,
    ]);

    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return null;
  }
}

const methods = {
  getDocumentData,
  analyzePdf,
  getRecommendation,
  getJobMatch
};

export default methods;
