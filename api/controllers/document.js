import express from "express";
import formidable from "formidable"; //
import ia from "../core/ia.js";
import firebase from "../core/firebase.js";

const router = express.Router();
const COLLECTION_NAME = "cvs";

router.post("/", async (req, res) => {
  const prompt = req.body;
  if (prompt.prompt) {
    const resp = await ia.getDocumentData(prompt.prompt);
    res.status(200).json({ data: resp });
  } else {
    res.status(404).json({ message: "No prompt entered" });
  }
});

router.post("/upload", async (req, res) => {
  const form = formidable({ multiples: false }); // Configure formidable for single file upload

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res
        .status(500)
        .json({ message: "Error parsing form data.", error: err });
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
        const added = await firebase.addData(
          COLLECTION_NAME,
          uniqueId,
          analysisResult
        );

        if (added) {
          return res.status(200).json({
            message: "File uploaded and added to DB successfully.",
            id: uniqueId,
          });
        } else {
          return res
            .status(500)
            .json({ message: "File saved, but data not added to DB." });
        }
      } else {
        return res
          .status(500)
          .json({ message: "File uploaded, but analysis failed." });
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      return res.status(500).json({
        message: "File uploaded, but analysis encountered an error.",
        error: error,
      });
    }
  });
});

router.get("/", async (req, res) => {
  const results = await firebase.getAllData(COLLECTION_NAME);
  return results
    ? res.status(200).json(results)
    : res.status(500).json({ message: "No results recovered" });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await firebase.deleteData(COLLECTION_NAME, id);
  return result
    ? res.status(200).json({ message: "Document was deleted" })
    : res.status(500).json({ message: "No results recovered" });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await firebase.getData(COLLECTION_NAME, id);
  return result
    ? res.status(200).json(result)
    : res.status(500).json({ message: "No results recovered" });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const form = formidable({ multiples: false }); // Configure formidable for single file upload

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res
        .status(500)
        .json({ message: "Error parsing form data.", error: err });
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
        const added = await firebase.updateData(
          COLLECTION_NAME,
          id,
          analysisResult
        );

        if (added) {
          return res.status(200).json({
            message: "File updated and added to DB successfully.",
            id: id,
          });
        } else {
          return res
            .status(500)
            .json({ message: "File saved, but data not added to DB." });
        }
      } else {
        return res
          .status(500)
          .json({ message: "File uploaded, but analysis failed." });
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      return res.status(500).json({
        message: "File uploaded, but analysis encountered an error.",
        error: error,
      });
    }
  });
});

router.post("/recommended", async (req, res) => {
  const prompt = req.body.prompt;
  const results = await firebase.getAllData(COLLECTION_NAME);
  if (results && results.length > 0 && prompt) {
    const answer = await ia.getRecommendation(prompt, results);
    if (!answer) {
      return res
        .status(500)
        .json({ message: "CVS was found but no processed" });
    }
    return res.status(200).json({ recommendation: answer });
  } else {
    return res.status(500).json({ message: "No CVS present in DB" });
  }
});

export default router;
