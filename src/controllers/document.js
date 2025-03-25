import express from 'express';
import formidable from 'formidable'; // 
import ia from '../core/ia.js'
import firebase from '../core/firebase.js'

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
    const form = formidable({ multiples: false }); // Configure formidable for single file upload

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ message: "Error parsing form data.", error: err });
        }

        // Check if file exists
        if (!files.myFile) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        const file = Array.isArray(files.myFile) ? files.myFile[0] : files.myFile; // Ensure compatibility for single uploads
        const pdfFilePath = file.filepath;

        try {
            // Perform PDF analysis
            const analysisResult = await ia.analyzePdf(pdfFilePath);

            if (analysisResult) {
                const uniqueId = `cv_${Date.now()}`; // Generate unique ID using timestamp
                const added = await firebase.addData("cvs", uniqueId, analysisResult);

                if (added) {
                    return res.status(200).json({ message: "File uploaded and added to DB successfully.", id: uniqueId });
                } else {
                    return res.status(500).json({ message: "File saved, but data not added to DB." });
                }
            } else {
                return res.status(500).json({ message: "File uploaded, but analysis failed." });
            }
        } catch (error) {
            console.error("Error during analysis:", error);
            return res.status(500).json({ message: "File uploaded, but analysis encountered an error.", error: error });
        }
    });
});
export default router;