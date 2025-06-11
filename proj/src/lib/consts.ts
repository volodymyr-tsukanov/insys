/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/

export enum EDatasetType {
  csv = 'text/csv',
  json = 'application/json',
  xml = 'application/xml',
  yaml = 'application/x-yaml'
};


export interface IDataset {
  contentType: EDatasetType;
  /** real thing */
  data: string;
  fetchDate: Date;
  modifiedDate?: Date;
  tag?: string;
};
// Main Datasets
export interface IDatasetRevitalization {
  projectsPlanned: Record<string, number>;
  projectsCompleted: Record<string, number>;
  renovatedFlats: Record<string, number>;
  /** in mln zl */
  renovationCostMln: Record<string, number>;
};
export interface IDatasetTourism {
  totalVisitors: Record<string, number>;
  tourists: Record<string, number>;
  infoCenterVisitors: Record<string, number>;
  foreignTourists: Record<string, number>;
  tourismBudget: Record<string, number>;
};
export interface IDatasetCultureInstitutions {
  publicLibraries: Record<string, number>;
  cultureCenters: Record<string, number>;
  cinemas: Record<string, number>;
  museums: Record<string, number>;
};
export interface IDatasetCultureBudget {
  totalSpending: Record<string, number>;
  /** na 1 mieszkanca */
  perCapitaSpending: Record<string, number>;
  /** % from total budget */
  budgetShare: Record<string, number>;
};
export interface IDatasetEvents {
  /** event organization cost (w mln zl) */
  spendingMln: Record<string, number>;
  /** % from total budget */
  spendingShare: Record<string, number>;
  /** leading data */
  participationByFestival: Record<string, Record<string, number>>;
  participantsPerCapita: Record<string, number>;
};
// Odd Datasets
export interface IDatasetHolidays {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};
// Calculated Datasets
/** Calculated using _MainDataset_ */
export interface IDatasetIntermediate {
  /** year → number of citizens */
  estimatedCitizens: Record<string, number>;
  /** needs normalization by 10k */
  institutionsPer10kCitizens: Record<string, number>;
  touristsPerCitizen: Record<string, number>;
  foreignTouristsPerCitizen: Record<string, number>;
  eventTotalParticipants: Record<string, number>;
}
/** Calculated using _MainDataset_ */
export interface IDatasetResults {
  eventParticipationPerCitizen: Record<string, number>;
  eventParticipationPerTourist: Record<string, number>;
  eventParticipationPerForeignTourist: Record<string, number>;
  costPerEventParticipant: Record<string, number>;
  revitalizationCompletionRate: Record<string, number>;
  cultureSpendingShareChange: Record<string, number>;
}
/** Final integration outputs */
export interface IEnrichedYear {
  year: string;
  // intermediate
  estimatedCitizens?: number;
  institutionsPer10kCitizens?: number;
  touristsPerCitizen?: number;
  eventTotalParticipants?: number;
  // results
  eventParticipationPerCitizen?: number;
  costPerEventParticipant?: number;
  revitalizationCompletionRate?: number;
  cultureSpendingShareChange?: number;
  // holiday stats
  holidayCount: number;
  holidaysByMonth: Record<string, number>;
  weekendCount: number;
  weekendsByMonth: Record<string, number>;
  // Derived metrics
  eventHolidayDensityIndex?: number;
  eventPerWeekend?: number;
  touristsPerWeekend?: number;
  holidayClusteringIndex?: number;
  institutionToWeekendRatio?: number;
  costPerWeekendParticipant?: number;
  // derived metrics (meaningful)
  weekendEventDensity?: number;
  eventHolidayAlignment?: number;
}


export const CYearRange = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const CMainDatasets = {
  revitalization: "https://otwartedane.lublin.eu/dataset/6f9a08f3-6d5c-4542-b80d-1aeb403d5243/resource/201c3188-e03a-4dee-83ab-dece8d532cfa/download/program-rewitalizacji-dla-lublina-na-lata-20172023.csv",
  tourism: "https://otwartedane.lublin.eu/dataset/fd45a655-f8fe-4e19-900d-24a36ea1a1e2/resource/f68f0dc5-3a14-49c8-b19c-2eb2a4c7c00b/download/strategia-rozwoju-turystyki-miasta-lublin-do-roku-2025.csv",
  cultureInstitutions: "https://otwartedane.lublin.eu/dataset/5f003dd7-9975-4055-84d2-a7ce9b0d38e9/resource/744fa9b7-ec52-44ec-97b6-2cdead3ee3fb/download/c.3.1.-instytucje-kultury-w-lublinie.csv",
  cultureBudget: "https://otwartedane.lublin.eu/dataset/9073336f-141e-4320-9a26-f9dbc80fcd0e/resource/d1e7bad3-87a2-45a6-992b-25694024a41d/download/d.1.4.-wydatki-na-kultur-w-przeliczeniu-na-jednego-mieszkaca-oraz-udzia-wydatkow-na-kultur-w-str.csv",
  events1: "https://otwartedane.lublin.eu/dataset/e0c1be78-60e5-40f9-b291-d384ae6b3c9b/resource/891720f5-2400-4139-b34e-ccfd40f0b047/download/strategia-rozwoju-kultury-lublina-na-lata-20132020.csv",
  events2: "https://otwartedane.lublin.eu/dataset/5587e7a4-872e-4200-8335-1cc75e3cf93d/resource/ca3c72ab-d97f-45e8-b6c0-7cccfa36ffb6/download/d.1.2.-liczba-uczestnikow-wybranych-wydarze-kulturalnych-oraz-imprez-artystyczno-rozrywkowych-og.csv",
};
export const COddDatasets = {
  holidays: "https://date.nager.at/api/v3/PublicHolidays/$/PL"
};
export const CEventsTotalCount = 11;
export const CEventMonths = {
  WielokulturowyLublin: 6,             // май–июнь, округлил до июня (6)
  CarnavalSztukmistrzow: 7,            // конец июля
  EuropejskiFestiwalSmaku: 7,          // лето (июнь–июль), округлил до июля (7)
  FestiwalKonfrontacjeTeatralne: 7,    // лето (июль–август), округлил до июля (7)
  FestiwalFantastykiFalkon: 11,        // ноябрь
  MiedzynarodoweSpotkaniaTeatrowTanca: 7, // лето (июль)
  NocKultury: 6,                       // первая суббота июня
  NocKulturyOnline: 6,                 // первая суббота июня (тот же месяц)
  WschodKulturyInneBrzmienia: 7,       // конец июня — начало июля, округлил до июля (7)
  FestiwalRetradycja: 8,               // конец августа
  MiedzynarodoweSpotkaniaFolklorystyczne: 12 // декабрь
};