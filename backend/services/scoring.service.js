import mongoose from "mongoose";
import Race from '../model/race.model.js';
import Result from '../model/result.model.js';
import Prediction from '../model/prediction.model.js';
import User from "../model/user.model.js";

const SCORING_POINTS = {
  POLE_POSITION_CORRECT: 5,
  PODIUM_CORRECT_DRIVER_WRONG_POSITION: 3,
  PODIUM_CORRECT_DRIVER_AND_POSITION: 8, 
};

export const scoreRace = async (season, round) => {
  console.log(`Starting scoring process for Season ${season}, Round ${round}...`);

  const race = await Race.findOne({ season, round });
  if(!race) res.status(404).json({ message: `Race not found for Season ${season}, Round ${round}` });

  if (race.status === 'completed') {
    console.log('Race is already scored. Aborting.');
    return { message: 'Race has already been scored.' };
  };

  const officialResult = await Result.findOne({ season, round });
  if (!officialResult) throw new Error(`Results not found for Season ${season}, Round ${round}`);

  const predictions = await Prediction.find({ race: race._id });
  if (predictions.length === 0) {
    console.log('No predictions found for this race. Marking as complete.');
    await Race.findByIdAndUpdate(race._id, { status: 'completed' });
    return { message: 'No predictions to score. Race marked as complete.' };
  }

  let predictionsScored = 0;
  
  for (const prediction of predictions) {
    let predictionScore = 0;

    if (prediction.polePosition === officialResult.polePosition) {
      predictionScore += SCORING_POINTS.POLE_POSITION_CORRECT;
    }

    prediction.podium.forEach((predictedDriver, index) => {
      const actualDriver = officialResult.podium[index];

      if (predictedDriver === actualDriver) {
        // Correct driver in the correct position
        predictionScore += SCORING_POINTS.PODIUM_CORRECT_DRIVER_AND_POSITION;
      } else if (officialResult.podium.includes(predictedDriver)) {
        // Correct driver but in the wrong position
        predictionScore += SCORING_POINTS.PODIUM_CORRECT_DRIVER_WRONG_POSITION;
      }
    });

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await Prediction.findByIdAndUpdate(prediction._id, { score: predictionScore }, { session });

      await User.findByIdAndUpdate(prediction.user, { $inc: { totalScore: predictionScore } }, { session });

      await session.commitTransaction();
      predictionsScored++;
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted for one prediction due to error:', error);
    } finally {
      session.endSession();
    }
  }

  await Race.findByIdAndUpdate(race._id, { status: 'completed' });

  const summary = `Scoring complete for Season ${season}, Round ${round}. Scored ${predictionsScored} predictions.`;
  console.log(summary);
  return { message: summary };
};