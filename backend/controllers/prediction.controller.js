import asyncHandler from 'express-async-handler';
import Prediction from '../model/prediction.model.js';
import Race from '../model/race.model.js';

const submitPrediction = asyncHandler(async(req, res) => {
  const { raceId, polePosition, podium } = req.body;

  if(!raceId || !polePosition || !podium) {
    res.status(400).json({ message: 'Please provide all required prediction fields.'});
  }

  const race = await Race.findById(raceId);

  if(!race) {
    res.status(404).json({ message: 'Race not found' });
  }

  if (race.status !== 'scheduled') {
    res.status(403).json({ message: `Predictions for this race are closed. Race status: ${race.status}`});
  }

  const query = {
    user: req.user._id,
    race: raceId,
  };

  const update = {
    polePosition,
    podium,
  };

  const options = {
    upsert: true,  // <-- If a document matching the query doesn't exist, create it.
    new: true,     // <-- Return the modified document rather than the original.
    runValidators: true, // <-- Ensure that model validations (e.g., podium size) are run.
  };

  const prediction = await Prediction.findOneAndUpdate(query, update, options);

  res.status(200).json(prediction);

});

export { submitPrediction as createPrediction };