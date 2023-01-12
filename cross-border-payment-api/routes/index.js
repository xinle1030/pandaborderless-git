import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to cross border payments");
});

export default router;
