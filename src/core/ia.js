import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getDocumentData(promp) {
    const result = await model.generateContent([promp]);
    return result.response;
}

const methods = {
    getDocumentData
}

export default methods;