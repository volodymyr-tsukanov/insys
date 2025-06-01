/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import mongoose, { Schema, model, models } from 'mongoose';
import { IDatasetIntermediate, IDatasetResults } from '@/lib/consts';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/insys';


// Connect only once (avoid during hot reloads in dev)
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI).catch((err) => console.error('Mongo connect error:', err));
}


// ---------- SCHEMAS ----------
// Generic "year-keyed record of numbers"
const RecordStringNumber = {
  type: Map,
  of: Number,
};

// Intermediate dataset schema
const IntermediateSchema = new Schema<IDatasetIntermediate>(
  {
    estimatedCitizens: RecordStringNumber,
    institutionsPerCitizen: RecordStringNumber,
    touristsPerCitizen: RecordStringNumber,
  },
  { timestamps: true }
);

// Results dataset schema
const ResultsSchema = new Schema<IDatasetResults>(
  {
    eventParticipationPerCitizen: RecordStringNumber,
    costPerEventParticipant: RecordStringNumber,
    eventBudgetShare: RecordStringNumber,
    revitalizationCompletionRate: RecordStringNumber,
    cultureSpendingShareChange: RecordStringNumber,
  },
  { timestamps: true }
);

// ---------- MODELS ----------

const IntermediateModel = models.Intermediate || model('Intermediate', IntermediateSchema);
const ResultsModel = models.Results || model('Results', ResultsSchema);

// ---------- FUNCTIONS ----------

export async function saveIntermediate(data: IDatasetIntermediate) {
  return await IntermediateModel.create(data);
}

export async function saveResults(data: IDatasetResults) {
  return await ResultsModel.create(data);
}

export async function getLatestIntermediate(): Promise<IDatasetIntermediate | null> {
  return (await IntermediateModel.findOne().sort({ createdAt: -1 }).lean()) as IDatasetIntermediate | null;
}

export async function getLatestResults(): Promise<IDatasetResults | null> {
  return (await ResultsModel.findOne().sort({ createdAt: -1 }).lean()) as IDatasetResults | null;
}
