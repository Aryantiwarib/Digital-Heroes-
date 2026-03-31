const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { plan } = req.body;
  
  // Standard plan prices in paise (INR) -> ₹1000 = 100000 paise
  const amount = plan === "yearly" ? 1000000 : 100000; 

  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Create pending subscription reference to track abandonment
    await Subscription.create({
      userId: req.user._id,
      plan,
      status: "pending",
      razorpayOrderId: order.id,
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating razorpay order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment verified successfully
    // Save/Update subscription
    
    // Deactivate previous subscriptions
    await Subscription.updateMany({ userId: req.user._id }, { status: "expired" });

    const startDate = new Date();
    const endDate = new Date();
    if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await Subscription.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "active",
        startDate,
        endDate,
        razorpaySubscriptionId: razorpay_payment_id,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "active" });

    res.json({ success: true, message: "Payment verified successfully", subscription });
  } else {
    res.status(400).json({ success: false, message: "Invalid Signature" });
  }
};

exports.webhook = async (req, res) => {
  // simplified webhook endpoint
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  try {
    const body = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expectedSignature === signature) {
      console.log("Valid webhook Event:", body.event);
      // Handle events e.g. payment.authorized, subscription.charged
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Webhook error", error: err.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user subscriptions" });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.findOneAndDelete({ _id: id, userId: req.user._id, status: 'pending' });
    if (!sub) return res.status(404).json({ success: false, message: "Subscription not found or cannot be cancelled" });
    res.json({ success: true, message: "Pending subscription cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling subscription" });
  }
};
