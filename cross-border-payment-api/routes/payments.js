import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get a list of cross border payments");
});

router.get("/:paymentId", (req, res) => {
  let paymentId = req.params.paymentId;
  res.send("Payment id: " + paymentId);
});

router.get("/:paymentId/confirm", (req, res) => {
  let paymentId = req.params.paymentId;
  res.send("Payment id to confirm: " + paymentId);
});

router.get("/confirm", (req, res) => {
  res.send("Confirm multiple previously initiated cross-border payments");
});
export default router;
