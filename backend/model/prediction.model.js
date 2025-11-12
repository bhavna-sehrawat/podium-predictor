import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    race: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Race',
      required: true,
    },
    polePosition: {
      type: String,
      required: [true, 'Pole position prediction is required'],
      trim: true
    },
    podium: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length === 3;
        },
        message: 'Podium must contain exactly 3 drivers.',
      },
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ user: 1, race: 1 }, { unique: true });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;