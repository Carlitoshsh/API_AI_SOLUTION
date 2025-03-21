import express from 'express';
import formidable from 'formidable'; // 
import ia from '../core/ia.js'

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

router.post('/upload', async (req, res) => {
    const form = formidable({ multiples: false }); // configure formidable
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).send("Error parsing form data.");
        }

        if (!files.myFile) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = files.myFile[0]; // formidable gives an array of files, even for single uploads.
        const pdfFilePath = file.filepath;

        try {
            const userPrompt = "Summarize the following CV and return the data in a valid JSON object. Do not include any markdown code blocks or additional text. Only output the JSON. Example output: {}, not put the ```json ...```";
            const analysisResult = await ia.analyzePdf(pdfFilePath, userPrompt);

            if (analysisResult) {
                res.send(analysisResult);
            } else {
                res.status(500).send("File uploaded, but analysis failed.");
            }
        } catch (error) {
            console.error("Error during analysis:", error);
            res.status(500).send("File uploaded, but analysis encountered an error.");
        }
    });
});

export default router;