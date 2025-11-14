import asyncHandler from 'express-async-handler';
import { scoreRace } from '../services/scoring.service.js';


const scoreRaceController = asyncHandler(async (req, res) => {
  const { season, round } = req.params;

  if (!season || !round) {
    res.status(400);
    throw new Error('Season and round are required');
  }

  try {
    const result = await scoreRace(Number(season), Number(round));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { scoreRaceController };