
import mongoose, { Document, Schema, Model } from 'mongoose';
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
const enrichedYearSchema = new Schema<IEnrichedYear>({
  year: { type: String, required: true },
  // Intermediate
  estimatedCitizens: { type: Number },
  institutionsPer10kCitizens: { type: Number },
  touristsPerCitizen: { type: Number },
  eventTotalParticipants: { type: Number },
  // Results
  eventParticipationPerCitizen: { type: Number },
  costPerEventParticipant: { type: Number },
  revitalizationCompletionRate: { type: Number },
  cultureSpendingShareChange: { type: Number },
  // Holiday stats
  holidayCount: { type: Number, required: true },
  holidaysByMonth: { type: Map, of: Number, required: true },
  weekendCount: { type: Number, required: true },
  weekendsByMonth: { type: Map, of: Number, required: true },
  // Derived metrics
  eventHolidayDensityIndex: { type: Number },
  eventPerWeekend: { type: Number },
  touristsPerWeekend: { type: Number },
  holidayClusteringIndex: { type: Number },
  institutionToWeekendRatio: { type: Number },
  costPerWeekendParticipant: { type: Number },
  // Derived metrics (meaningful)
  weekendEventDensity: { type: Number },
  eventHolidayAlignment: { type: Number },
}, { timestamps: true });

// Mongoose Models
const DatasetIntermediate = mongoose.model<IDatasetIntermediate & Document>('DatasetIntermediate', datasetIntermediateSchema);
const DatasetResults = mongoose.model<IDatasetResults & Document>('DatasetResults', datasetResultsSchema);
const EnrichedYear = mongoose.model('EnrichedYear', enrichedYearSchema);

// Exporting Models
export { DatasetIntermediate, DatasetResults, EnrichedYear };
