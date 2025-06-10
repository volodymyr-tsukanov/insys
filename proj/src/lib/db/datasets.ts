import mongoose, { Document, Schema, Model } from 'mongoose';
import { IDatasetIntermediate, IDatasetResults, IEnrichedYear } from '../consts';

let isConnected = false;
export const connectDb = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    // Establish the connection
    await mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/insys');
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}; connectDb();


// Schema for DatasetIntermediate
const datasetIntermediateSchema = new Schema<IDatasetIntermediate>({
  estimatedCitizens: {
    type: Map,
    of: Number,
    required: true
  },
  institutionsPer10kCitizens: {
    type: Map,
    of: Number,
    required: true
  },
  touristsPerCitizen: {
    type: Map,
    of: Number,
    required: true
  },
  foreignTouristsPerCitizen: {
    type: Map,
    of: Number,
    required: true
  },
  eventTotalParticipants: {
    type: Map,
    of: Number,
    required: true
  }
}, { timestamps: true });

// Schema for DatasetResults
const datasetResultsSchema = new Schema<IDatasetResults>({
  eventParticipationPerCitizen: {
    type: Map,
    of: Number,
    required: true
  },
  eventParticipationPerTourist: {
    type: Map,
    of: Number,
    required: true
  },
  eventParticipationPerForeignTourist: {
    type: Map,
    of: Number,
    required: true
  },
  costPerEventParticipant: {
    type: Map,
    of: Number,
    required: true
  },
  revitalizationCompletionRate: {
    type: Map,
    of: Number,
    required: true
  },
  cultureSpendingShareChange: {
    type: Map,
    of: Number,
    required: true
  }
}, { timestamps: true });

const enrichedYearSchema = new Schema({
  year: {
    type: String,
    required: true,
  },
  estimatedCitizens: {
    type: Number,
    required: false,
  },
  institutionsPer10kCitizens: {
    type: Number,
    required: false,
  },
  touristsPerCitizen: {
    type: Number,
    required: false,
  },
  eventTotalParticipants: {
    type: Number,
    required: false,
  },
  eventParticipationPerCitizen: {
    type: Number,
    required: false,
  },
  costPerEventParticipant: {
    type: Number,
    required: false,
  },
  revitalizationCompletionRate: {
    type: Number,
    required: false,
  },
  cultureSpendingShareChange: {
    type: Number,
    required: false,
  },
  holidayCount: {
    type: Number,
    required: true,
  },
  holidaysByMonth: {
    type: Map,
    of: Number,
    required: true,
  },
  eventPerHoliday: {
    type: Number,
    required: false,
  },
  touristsPerHoliday: {
    type: Number,
    required: false,
  },
  holidayClusteringIndex: {
    type: Number,
    required: false,
  },
  institutionToHolidayRatio: {
    type: Number,
    required: false,
  },
  costPerHolidayParticipant: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

// Mongoose Models
const DatasetIntermediate = mongoose.model<IDatasetIntermediate & Document>('DatasetIntermediate', datasetIntermediateSchema);
const DatasetResults = mongoose.model<IDatasetResults & Document>('DatasetResults', datasetResultsSchema);
const EnrichedYear = mongoose.model('EnrichedYear', enrichedYearSchema);

// Exporting Models
export { DatasetIntermediate, DatasetResults, EnrichedYear };
