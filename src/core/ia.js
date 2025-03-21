import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'

const key = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getDocumentData(promp) {
    const result = await model.generateContent([promp]);
    return result.response;
}

async function analyzePdf(pdfFilePath, prompt) {
    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const pdfBase64 = pdfBuffer.toString('base64');

        const imageParts = [{
            inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
            },
        }];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        return text;

    } catch (error) {
        console.error("Error analyzing PDF:", error);
        return null;
    }
}

const methods = {
    getDocumentData,
    analyzePdf
}

export default methods;