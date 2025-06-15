
import mongoose, { Document, Schema } from 'mongoose';
import {
  IDatasetIntermediate,
  IDatasetResults,
  IEnrichedYear,
} from '../consts';


// --- DB Connection ---
export const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/insys');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}; connectDb();


// --- Intermediate Dataset Schema ---
const datasetIntermediateSchema = new Schema<IDatasetIntermediate>({
  estimatedCitizens: { type: Map, of: Number, required: true },
  institutionsPer10kCitizens: { type: Map, of: Number, required: true },
  touristsPerCitizen: { type: Map, of: Number, required: true },
  foreignTouristsPerCitizen: { type: Map, of: Number, required: true },
  eventTotalParticipants: { type: Map, of: Number, required: true },
}, { timestamps: true });
// --- Results Dataset Schema ---
const datasetResultsSchema = new Schema<IDatasetResults>({
  eventParticipationPerCitizen: { type: Map, of: Number, required: true },
  eventParticipationPerTourist: { type: Map, of: Number, required: true },
  eventParticipationPerForeignTourist: { type: Map, of: Number, required: true },
  costPerEventParticipant: { type: Map, of: Number, required: true },
  revitalizationCompletionRate: { type: Map, of: Number, required: true },
  cultureSpendingShareChange: { type: Map, of: Number, required: true },
}, { timestamps: true });
// --- Enriched Year Schema (Final Integration Outputs) ---
const enrichedYearSchema = new Schema<IEnrichedYear & Document>({
  year: { type: String, required: true },
  estimatedCitizens: Number,
  institutionsPer10kCitizens: Number,
  touristsPerCitizen: Number,
  eventTotalParticipants: Number,
  eventParticipationPerCitizen: Number,
  costPerEventParticipant: Number,
  revitalizationCompletionRate: Number,
  cultureSpendingShareChange: Number,
  holidayCount: { type: Number, required: true },
  holidaysByMonth: { type: Map, of: Number, required: true },
  weekendCount: Number,
  weekendsByMonth: { type: Map, of: Number },
  eventHolidayDensityIndex: Number,
  eventPerWeekend: Number,
  touristsPerWeekend: Number,
  holidayClusteringIndex: Number,
  institutionToWeekendRatio: Number,
  costPerWeekendParticipant: Number,
  weekendEventDensity: Number,
  eventHolidayAlignment: Number,
}, { timestamps: true });

// Mongoose Models
const DatasetIntermediate = mongoose.models.DatasetIntermediate ||
  mongoose.model<IDatasetIntermediate & Document>('DatasetIntermediate', datasetIntermediateSchema);
const DatasetResults = mongoose.models.DatasetResults ||
  mongoose.model<IDatasetResults & Document>('DatasetResults', datasetResultsSchema);
const EnrichedYear = mongoose.models.EnrichedYear ||
  mongoose.model<IEnrichedYear & Document>('EnrichedYear', enrichedYearSchema);

// Exporting Models
export { DatasetIntermediate, DatasetResults, EnrichedYear };
