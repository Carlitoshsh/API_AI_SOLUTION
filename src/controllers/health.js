import express from "express";

const router = express.Router();

router.get('/', (res, req) => {
    res.status(200).json({ message: "Healthy" })
})

export default router;
