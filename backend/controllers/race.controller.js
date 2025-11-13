import asyncHandler from 'express-async-handler';
import Race from '../model/race.model.js';

const getRacesSchedule = asyncHandler(async (req, res) => {
  const currentSeason = new Date().getFullYear();

  let races = await Race.find({ season: currentSeason }).sort({ round: 'asc' });

  if (races.length === 0) {
    console.log(`No races found for cureetn season ${currentSeason}. Falling back to latest avaiable season.`);

    const latestRace = await Race.findOne().sort({ season: 'desc'});

    if(latestRace) {
      races = await Race.find({ season: latestRace.season }).sort({ round: 'asc'});
    }
  }

  res.status(200).json(races);
});

export { getRacesSchedule };