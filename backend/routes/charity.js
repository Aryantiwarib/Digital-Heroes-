const express = require("express");
const { getCharities, addCharity, updateCharity, deleteCharity } = require("../controllers/charityController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCharities);
router.post("/", protect, authorize("admin"), addCharity);
router.put("/:id", protect, authorize("admin"), updateCharity);
router.delete("/:id", protect, authorize("admin"), deleteCharity);

module.exports = router;
