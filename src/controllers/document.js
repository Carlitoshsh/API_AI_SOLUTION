import express from 'express';
import ia from '../core/ia.js'
import { upload } from '../core/processFile.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const prompt = req.body
    if (prompt.prompt) {
        const resp = await ia.getDocumentData(prompt.prompt)
        res.status(200).json({ data: resp })
    } else {
        res.status(404).json({ message: "No prompt entered" })
    }
})

router.post('/upload', upload.single('myFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log('file uploaded: ', req.file);

    const pdfFilePath = req.file.path; // Get the path to the uploaded file

    try {
        const userPrompt = "Summarize the main points of this document."; // Example prompt
        const analysisResult = await ia.analyzePdf(pdfFilePath, userPrompt);

        if (analysisResult) {
            res.send(`File uploaded and analyzed successfully! Analysis: ${analysisResult}`); //send analysis result to user.
            console.log("Analysis Result:", analysisResult);
        } else {
            res.status(500).send("File uploaded, but analysis failed.");
        }
    } catch (error) {
        console.error("Error during analysis:", error);
        res.status(500).send("File uploaded, but analysis encountered an error.");
    }
});

export default router;