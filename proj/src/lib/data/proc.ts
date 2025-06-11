/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { CEventMonths, CYearRange, IDatasetCultureBudget, IDatasetCultureInstitutions, IDatasetEvents, IDatasetHolidays, IDatasetIntermediate, IDatasetResults, IDatasetRevitalization, IDatasetTourism, IEnrichedYear } from "../consts";
import { string2number } from "./convert";
import { getAllDatasets } from "./getter";

const NAMESPACE = 'data::proc:';


export class ProcError extends Error {
  static CAUSE = 'ECProc';
  name: string;
  constructor(message: string) {
    super(NAMESPACE + message, { cause: ProcError.CAUSE });
    this.name = 'ProcError';
  }
}


function procIntermediates(
  cultureBudget: IDatasetCultureBudget,
  cultureInstitutions: IDatasetCultureInstitutions,
  tourism: IDatasetTourism,
  events: IDatasetEvents
): IDatasetIntermediate {
  const estimatedCitizens: Record<string, number> = {};
  const institutionsPer10kCitizens: Record<string, number> = {};
  const touristsPerCitizen: Record<string, number> = {};
  const foreignTouristsPerCitizen: Record<string, number> = {};
  const eventTotalParticipants: Record<string, number> = {};

  const years: string[] = CYearRange.map(String);
  for (const year of years) {
    const total = cultureBudget.totalSpending[year];
    const perCapita = cultureBudget.perCapitaSpending[year];
    if (!total || !perCapita || Number.isNaN(total) || Number.isNaN(perCapita) || perCapita === 0) continue;

    const citizens = Math.round(total / perCapita);
    estimatedCitizens[year] = citizens;
    if (cultureInstitutions?.publicLibraries?.[year]) {
      const v = cultureInstitutions.publicLibraries[year];
      if (v != null && !Number.isNaN(v)) institutionsPer10kCitizens[year] = v * 10_000 / citizens;
    }
    if (tourism?.tourists?.[year]) {
      const v = tourism.tourists[year];
      if (v != null && !Number.isNaN(v)) touristsPerCitizen[year] = v / citizens;
    }
    if (tourism?.foreignTourists?.[year]) {
      const v = tourism.foreignTourists[year];
      if (v != null && !Number.isNaN(v)) foreignTouristsPerCitizen[year] = v / citizens;
    }

    const participationByFestival = Object.values(events.participationByFestival).map(e => e[year]);
    if (participationByFestival) {
      let totalParticipants = 0;
      for (const key in participationByFestival) {
        const raw = participationByFestival[key];
        const v = typeof raw === 'number' ? raw : Number(raw);
        if (!Number.isFinite(v)) continue;
        totalParticipants += v;
      }
      eventTotalParticipants[year] = totalParticipants;
    }
  }

  return {
    estimatedCitizens,
    institutionsPer10kCitizens,
    touristsPerCitizen,
    foreignTouristsPerCitizen,
    eventTotalParticipants
  };
}

function procResults(
  events: IDatasetEvents,
  cultureBudget: IDatasetCultureBudget,
  revitalization: IDatasetRevitalization,
  tourism: IDatasetTourism,
  intermediate: IDatasetIntermediate
): IDatasetResults {
  const eventParticipationPerCitizen: Record<string, number> = {};
  const eventParticipationPerTourist: Record<string, number> = {};
  const eventParticipationPerForeignTourist: Record<string, number> = {};
  const costPerEventParticipant: Record<string, number> = {};
  const revitalizationCompletionRate: Record<string, number> = {};
  const cultureSpendingShareChange: Record<string, number> = {};

  const years: string[] = CYearRange.map(String);
  for (const year of years) {
    const citizens = intermediate.estimatedCitizens[year];
    const tourists = tourism.tourists[year];
    const foreignTourists = tourism.foreignTourists[year];
    const totalParticipants = intermediate.eventTotalParticipants[year];

    const spendingMln = events.spendingMln[year];
    const cultureSpend = cultureBudget.totalSpending[year];
    const spendShare = cultureBudget.budgetShare[year];
    const prevSpendShare = cultureBudget.budgetShare[(Number(year) - 1).toString()];

    console.log(spendingMln, cultureSpend, '   ', spendShare, prevSpendShare);

    if (totalParticipants && totalParticipants > 0) {
      if (citizens && citizens > 0) {
        eventParticipationPerCitizen[year] = totalParticipants / citizens;
      }
      if (tourists && tourists > 0) {
        eventParticipationPerTourist[year] = totalParticipants / tourists;
      }
      if (foreignTourists && foreignTourists > 0) {
        eventParticipationPerForeignTourist[year] = totalParticipants / foreignTourists;
      }
      if (spendingMln && spendingMln > 0) {
        costPerEventParticipant[year] = (spendingMln * 1_000_000) / totalParticipants;
      }
    }
    if (spendShare && spendShare > 0 && prevSpendShare && prevSpendShare > 0) {
      cultureSpendingShareChange[year] = spendShare - prevSpendShare;
    }

    const planned = revitalization.projectsPlanned[year];
    const completed = revitalization.projectsCompleted[year];
    if (!Number.isNaN(planned) && planned > 0 && !Number.isNaN(completed)) {
      revitalizationCompletionRate[year] = completed / planned;
    }
  }

  return {
    eventParticipationPerCitizen,
    eventParticipationPerTourist,
    eventParticipationPerForeignTourist,
    costPerEventParticipant,
    revitalizationCompletionRate,
    cultureSpendingShareChange,
  };
}

function procWeekends(yearStr: string): { weekendCount: number, weekendsByMonth: Record<string, number> } {
  const year = string2number(yearStr, 'integer');
  if (!Number.isFinite(year)) throw new Error('crap year');
  const startDate = new Date(year, 0, 1, 1), endDate = new Date(year + 1, 0, 1);
  const weekendsByMonth: Record<string, number> = {};
  let weekendCount = 0;
  for (let date = startDate; date < endDate; date.setUTCDate(date.getUTCDate() + 1)) {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      weekendCount++;
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // month 0-indexed
      weekendsByMonth[month] = (weekendsByMonth[month] || 0) + 1;
    }
  }
  return { weekendCount, weekendsByMonth };
}

/** Used to integrate _MainDataset_ calculations (from **proc**) with _OddDataset_ */
function enrichWithHolidays(
  intermediate: IDatasetIntermediate,
  results: IDatasetResults,
  holidays: { [year: string]: IDatasetHolidays[] }
): IEnrichedYear[] {
  const years: string[] = CYearRange.map(String);

  return Array.from(years)
    .sort()
    .map(year => {
      const hols = holidays[year] || [];
      const holidayCount = hols.length;

      const holidaysByMonth: Record<string, number> = {};
      const holidayDates = hols.map(h => new Date(h.date).getTime()).sort((a, b) => a - b);
      const holidayDayGaps: number[] = [];
      const { weekendCount, weekendsByMonth } = procWeekends(year);

      // For metric #3: holidayClusteringIndex
      for (let i = 1; i < holidayDates.length; i++) {
        const gap = (holidayDates[i] - holidayDates[i - 1]) / (1000 * 60 * 60 * 24); // in days
        holidayDayGaps.push(gap);
      }
      const meanGap = holidayDayGaps.reduce((sum, val) => sum + val, 0) / (holidayDayGaps.length || 1);
      const stdGap = Math.sqrt(
        holidayDayGaps.reduce((acc, val) => acc + Math.pow(val - meanGap, 2), 0) / (holidayDayGaps.length || 1)
      );

      // Prepare raw values
      const citizens = intermediate.estimatedCitizens[year];
      const tourists = intermediate.touristsPerCitizen?.[year] && citizens
        ? intermediate.touristsPerCitizen[year] * citizens
        : undefined;
      const eventParticipants = intermediate.eventTotalParticipants?.[year];
      const costPerEvent = results.costPerEventParticipant?.[year];
      const institutionsPer10k = intermediate.institutionsPer10kCitizens?.[year];

      const eventPerWeekend = eventParticipants
        ? eventParticipants / weekendCount
        : undefined;
      const touristsPerWeekend = tourists
        ? tourists / weekendCount
        : undefined;

      // Metric 3: holidayClusteringIndex (standard deviation of day gaps)
      const holidayClusteringIndex = holidayDayGaps.length > 0 ? stdGap : undefined;

      // Metric 4: eventHolidayDensityIndex
      const eventsPerMonth: Record<string, number> = {};
      Object.values(CEventMonths).forEach(month => {
        const m = month.toString().padStart(2, '0');
        eventsPerMonth[m] = (eventsPerMonth[m] || 0) + 1;
      });
      const holidayEventDensityRatios: number[] = Object.entries(holidaysByMonth)
        .filter(([month, holCount]) => holCount > 0)
        .map(([month, holCount]) => {
          const eventCount = eventsPerMonth[month] || 0;
          return eventCount / holCount;
        });
      const eventHolidayDensityIndex = holidayEventDensityRatios.length > 0
        ? holidayEventDensityRatios.reduce((sum, val) => sum + val, 0) / holidayEventDensityRatios.length
        : undefined;

      // Metric 5: institutionToHolidayRatio
      const institutionToWeekendRatio = institutionsPer10k
        ? institutionsPer10k * 10_000 / weekendCount
        : undefined;

      // Metric 6: costPerHolidayParticipant
      const costPerWeekendParticipant = eventParticipants && costPerEvent
        ? costPerEvent * eventParticipants / weekendCount
        : undefined;

      hols.forEach(h => {
        const m = (new Date(h.date).getMonth() + 1).toString().padStart(2, '0');
        holidaysByMonth[m] = (holidaysByMonth[m] || 0) + 1;
      });

      return {
        year,
        // intermediate
        estimatedCitizens: citizens,
        institutionsPer10kCitizens: institutionsPer10k,
        touristsPerCitizen: intermediate.touristsPerCitizen[year],
        eventTotalParticipants: eventParticipants,
        // results
        eventParticipationPerCitizen: results.eventParticipationPerCitizen[year],
        costPerEventParticipant: costPerEvent,
        revitalizationCompletionRate: results.revitalizationCompletionRate[year],
        cultureSpendingShareChange: results.cultureSpendingShareChange[year],
        // holiday stats
        holidayCount,
        holidaysByMonth,
        weekendCount,
        weekendsByMonth,
        // derived metrics
        eventHolidayDensityIndex,
        eventPerWeekend,
        touristsPerWeekend,
        holidayClusteringIndex,
        institutionToWeekendRatio,
        costPerWeekendParticipant,
      } as IEnrichedYear;
    });
}


export interface IDatasetProcessed {
  intermediate: IDatasetIntermediate;
  results: IDatasetResults;
  integrated: IEnrichedYear[];
};
/** Used to make all the calculations */
export async function proc(): Promise<IDatasetProcessed> {
  const {
    cultureBudget,
    revitalization,
    tourism,
    events,
    cultureInstitutions,
    holidays
  } = await getAllDatasets();

  const intermediate = procIntermediates(cultureBudget, cultureInstitutions, tourism, events);
  const results = procResults(events, cultureBudget, revitalization, tourism, intermediate);
  const integrated = enrichWithHolidays(intermediate, results, holidays);

  return {
    intermediate,
    results,
    integrated
  };
}
