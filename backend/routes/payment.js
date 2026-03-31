const express = require("express");
const { createOrder, verifyPayment, webhook, getAllSubscriptions, getMySubscriptions, cancelSubscription } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/webhook", webhook); // Razorpay needs to hit this publicly
router.get("/subscriptions", protect, authorize("admin"), getAllSubscriptions);
router.get("/my-subscriptions", protect, getMySubscriptions);
router.delete("/cancel/:id", protect, cancelSubscription);

module.exports = router;
