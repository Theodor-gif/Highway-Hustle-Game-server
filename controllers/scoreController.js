import Score from "../models/score.model.js";
import User from "../models/user.model.js";

const getScores = async (req, res) => {
  try {
    const allScores = await Score.find().populate("player");
    res.status(200).json(allScores);
  } catch (error) {
    res.status(500).json({ message: "No data", error: error.message });
  }
};

const addScore = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { score } = req.body;
    const player = req.user.id;

    if (typeof score !== "number" || !Number.isFinite(score) || score < 0) {
      return res.status(400).json({ message: "Invalid score" });
    }

    const playerName = await User.findById(player);
    if (!playerName) {
      return res.status(400).json({ message: "This player does not exist" });
    }

    const playerScore = await Score.findOne({ player });
    if (playerScore && playerScore.score >= score) {
      return res.status(400).json({ message: "Same or low score" });
    }

    const existed = Boolean(playerScore);

    const updatedScore = await Score.findOneAndUpdate(
      { player },
      { score, firstname: playerName.firstname },
      { new: true, upsert: true },
    );

    res.status(existed ? 200 : 201).json(updatedScore);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not create score", error: error.message });
  }
};

export { getScores, addScore };
