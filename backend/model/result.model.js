import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  season: {
    type: Number,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  polePosition: {
    type: String,
    required: true,
  },
  podium: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,
});


resultSchema.index({ season: 1, round: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);

export default Result;