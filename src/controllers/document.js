import express from 'express';
import ia from '../core/ia.js'

const router = express.Router();

router.get('/', async (req, res) => {
    const prompt = req.query.prompt
    res.status(200).json(ia.getDocumentData(prompt))
})

export default router;