import express from "express";
import firebase from "../core/firebase.js";
import ia from "../core/ia.js";

const router = express.Router();
const COLLECTION_NAME = "open_positions";

// Add a new open position
router.post("/", async (req, res) => {
    try {
        const newPosition = req.body;
        const openPosId = `job_${Date.now()}`; // Generate unique ID using timestamp
        const docRef = await firebase.addData(COLLECTION_NAME, openPosId, newPosition);
        if(docRef) {
            res.status(200).json({ message: 'Created!', id: openPosId})
        } else {
            res.status(204).json({ message: 'No generated' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing open position
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPosition = req.body;
        const docRef = await firebase.updateData(COLLECTION_NAME, id, updatedPosition);
        if(docRef) {
            res.status(200).json({ message: 'Updated!', id: id})
        } else {
            res.status(204).json({ message: 'No generated' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an open position
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = await firebase.deleteData(COLLECTION_NAME, id);
        if(docRef) {
            res.status(200).json({ message: `Open position with id ${id} deleted successfully` });
        } else {
            res.status(204).json({ message: 'No generated' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Query all open positions
router.get("/", async (req, res) => {
    try {
        const positions = await firebase.getAllData(COLLECTION_NAME);
        if(positions) {
            res.status(200).json(positions)
        } else {
            res.status(204).json({ message: 'No available'})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = await firebase.getData(COLLECTION_NAME, id);
        if(docRef) {
            res.status(200).json(docRef)
        } else {
            res.status(204).json({ message: 'No generated' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/recommended", async (req, res) => {
    const prompt = req.body.prompt;
    const results = await firebase.getAllData(COLLECTION_NAME);
    if (results && results.length > 0 && prompt) {
      const answer = await ia.getJobMatch(prompt, results);
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