const Draw = require("../models/Draw");
const Score = require("../models/Score");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const DrawSettings = require("../models/DrawSettings");

exports.runDraw = async (req, res) => {
  const { type } = req.body;

  try {

    // 1. Calculate Active Users total subscriptions
    const activeSubs = await Subscription.find({ status: "active" });
    const totalSubscribers = activeSubs.length;
    // Assuming 1000 INR monthly sub, taking a cut of that for prize pool (e.g., 20% of revenue to prize pool)
    const totalPrizePool = totalSubscribers * 1000 * 0.20;

    let winningNumbers = [];
    if (type === "random") {
      while(winningNumbers.length < 5) {
        let r = Math.floor(Math.random() * 45) + 1;
        if(winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
      }
    } else {
      // Algorithmic: get frequencies
      const allScores = await Score.find();
      const freq = {};
      allScores.forEach(s => freq[s.score] = (freq[s.score] || 0) + 1);
      
      const sortedFreqs = Object.keys(freq).sort((a,b) => freq[b] - freq[a]);
      // Top 5 most frequent
      winningNumbers = sortedFreqs.slice(0, 5).map(Number);
      
      // Fallback if less than 5 distinct scores
      while(winningNumbers.length < 5) {
        let r = Math.floor(Math.random() * 45) + 1;
        if(winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
      }
    }

    // Evaluate Matches
    const activeUserIds = activeSubs.map(sub => sub.userId.toString());
    const usersScores = {};
    const allScores = await Score.find();
    
    // Group by user with enforced Active Subscriber constraint
    allScores.forEach(s => {
      const uid = s.userId.toString();
      if (!activeUserIds.includes(uid)) return; // Skip inactive entities from winning
      if (!usersScores[uid]) usersScores[uid] = [];
      usersScores[uid].push(s.score);
    });

    const results = [];
    
    let matchCounts = { 3: 0, 4: 0, 5: 0 };
    Object.keys(usersScores).forEach(uid => {
      const userList = usersScores[uid];
      const matchLevel = userList.filter(uS => winningNumbers.includes(uS)).length;
      if (matchLevel >= 3 && matchLevel <= 5) {
        results.push({ userId: uid, matchCount: matchLevel, prizeShare: 0 });
        matchCounts[matchLevel]++;
      }
    });

    // Splitting the prize pool with Rollover Logic
    let settings = await DrawSettings.findOne({ key: "rollover" });
    if (!settings) {
      settings = await DrawSettings.create({ key: "rollover", jackpotRollover: 0 });
    }

    const tierPrizes = {
      5: (totalPrizePool * 0.40) + settings.jackpotRollover,
      4: totalPrizePool * 0.35,
      3: totalPrizePool * 0.25,
    };

    let newRollover = 0;
    if (matchCounts[5] === 0) {
      newRollover = tierPrizes[5]; // Projected rollover
    }

    results.forEach(res => {
      if (matchCounts[res.matchCount] > 0) {
        res.prizeShare = tierPrizes[res.matchCount] / matchCounts[res.matchCount];
      }
    });

    const draw = await Draw.create({
      status: "simulated",
      drawDate: new Date(),
      type,
      winningNumbers,
      results,
      totalPrizePool,
    });

    res.json({ success: true, draw });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getDrawResults = async (req, res) => {
  try {
    const draws = await Draw.find().populate("results.userId", "name email").sort({ drawDate: -1 });
    res.json({ success: true, draws });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.publishDraw = async (req, res) => {
  const { id } = req.params;
  try {
    const draw = await Draw.findById(id);
    if (!draw) return res.status(404).json({ success: false, message: "Draw not found" });
    if (draw.status === "published") return res.status(400).json({ success: false, message: "Draw is already published" });

    let match5Count = 0;
    draw.results.forEach(r => {
      if (r.matchCount === 5) {
        match5Count++;
      }
    });

    let newRollover = 0;
    if (match5Count === 0) {
      let settings = await DrawSettings.findOne({ key: "rollover" });
      newRollover = (draw.totalPrizePool * 0.40) + (settings ? settings.jackpotRollover : 0);
    }
    
    await DrawSettings.findOneAndUpdate({ key: "rollover" }, { jackpotRollover: newRollover }, { upsert: true, new: true });

    draw.status = "published";
    await draw.save();

    res.json({ success: true, message: "Draw published", draw });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
