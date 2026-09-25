import Score from "../models/score.model.js";
import User from "../models/user.model.js";

const getScores = async (req, res) => {
  try {
    const allScores = await Score.find().populate("player");
    res.status(200).json(allScores);
  } catch (error) {
    res.status(500).json({ message: "Not data", error });
  }
};

const addScore = async (req, res) => {
  try {
    const { score } = req.body;
    const player = req.user.id;

    if (score === undefined) {
      return res.status(400).json({ message: "Not score" });
    }

    const playerName = await User.findById(player); // ✅ added back
    if (!playerName) {
      return res.status(400).json({ message: "this player does not exist" });
    }

    const playerScore = await Score.findOne({ player });
    if (playerScore && playerScore.score >= score) {
      return res.status(400).json({ message: "Same or low score" });
    }

    const updatedScore = await Score.findOneAndUpdate(
      { player }, // find by this filter
      { score, firstname: playerName.firstname }, // fields to set
      { new: true, upsert: true }, // return updated doc, create if missing
    );

    res.status(201).json(updatedScore);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not create score", error: error.message });
  }
};

export { getScores, addScore };
