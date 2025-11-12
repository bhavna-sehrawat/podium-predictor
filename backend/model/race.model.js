import mongoose from 'mongoose';

const raceSchema = new mongoose.Schema(
  {
    season: {
      type: Number,
      required: [true, 'Season year is required'],
    },
    round: {
      type: Number,
      required: [true, 'Round number is required'],
    },
    raceName: {
      type: String,
      required: [true, 'Race name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Race date and time are required'],
    },
    status: {
      type: String,
      enum: { 
        values: ['scheduled', 'locked', 'completed'],
        message: '{VALUE} is not a supported status'
    },
    default: 'scheduled',
    },
  },
  {
  timestamps: true,
  }
);

raceSchema.index({season: 1, round: 1}, {unique: true});

const Race = mongoose.model('Race', raceSchema);

export default Race;