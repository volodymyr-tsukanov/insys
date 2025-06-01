/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { IDatasetCultureBudget, IDatasetCultureInstitutions, IDatasetEvents, IDatasetIntermediate, IDatasetResults, IDatasetRevitalization, IDatasetTourism } from "../consts";
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
  tourism: IDatasetTourism
): IDatasetIntermediate {
  const estimatedCitizens: Record<string, number> = {};
  const institutionsPerCitizen: Record<string, number> = {};
  const touristsPerCitizen: Record<string, number> = {};

  for (const year of Object.keys(cultureBudget.totalSpending)) {
    const total = cultureBudget.totalSpending[year];
    const perCapita = cultureBudget.perCapitaSpending[year];

    if (Number.isNaN(total) || Number.isNaN(perCapita) || perCapita === 0) continue;

    const citizens = Math.round(total / perCapita);
    estimatedCitizens[year] = citizens;

    if (cultureInstitutions?.publicLibraries?.[year]) {
      const value = cultureInstitutions.publicLibraries[year];
      if (!Number.isNaN(value)) {
        institutionsPerCitizen[year] = value / citizens;
      }
    }

    if (tourism?.tourists?.[year]) {
      const value = tourism.tourists[year];
      if (!Number.isNaN(value)) {
        touristsPerCitizen[year] = value / citizens;
      }
    }
  }

  return {
    estimatedCitizens,
    institutionsPerCitizen: Object.keys(institutionsPerCitizen).length ? institutionsPerCitizen : undefined,
    touristsPerCitizen: Object.keys(touristsPerCitizen).length ? touristsPerCitizen : undefined,
  };
}

function procResults(
  events: IDatasetEvents,
  cultureBudget: IDatasetCultureBudget,
  revitalization: IDatasetRevitalization,
  intermediate: IDatasetIntermediate
): IDatasetResults {
  const eventParticipationPerCitizen: Record<string, number> = {};
  const costPerEventParticipant: Record<string, number> = {};
  const eventBudgetShare: Record<string, number> = {};
  const revitalizationCompletionRate: Record<string, number> = {};
  const cultureSpendingShareChange: Record<string, number> = {};

  const years = Object.keys(events.spendingMln);

  for (const year of years) {
    const citizens = intermediate.estimatedCitizens[year];
    const totalParticipants = Object.values(events.participationByFestival)
      .map(e => e[year])
      .reduce((acc, val) => acc + (Number.isNaN(val) ? 0 : val), 0);

    const spending = events.spendingMln[year];
    const cultureSpend = cultureBudget.totalSpending[year];
    const spendShare = cultureBudget.budgetShare[year];
    const prevSpendShare = cultureBudget.budgetShare[(+year - 1).toString()];

    if (!Number.isNaN(totalParticipants) && !Number.isNaN(citizens) && citizens > 0) {
      eventParticipationPerCitizen[year] = totalParticipants / citizens;
    }
    if (!Number.isNaN(spending) && totalParticipants > 0) {
      costPerEventParticipant[year] = (spending * 1_000_000) / totalParticipants;
    }
    if (!Number.isNaN(spending) && !Number.isNaN(cultureSpend) && cultureSpend > 0) {
      eventBudgetShare[year] = (spending * 1_000_000) / cultureSpend;
    }
    if (!Number.isNaN(spendShare) && !Number.isNaN(prevSpendShare)) {
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
    costPerEventParticipant,
    eventBudgetShare,
    revitalizationCompletionRate,
    cultureSpendingShareChange,
  };
}

export async function proc(): Promise<{
  intermediate: IDatasetIntermediate;
  results: IDatasetResults;
}> {
  const {
    cultureBudget,
    revitalization,
    tourism,
    events,
    cultureInstitutions,
  } = await getAllDatasets();

  const intermediate = procIntermediates(cultureBudget, cultureInstitutions, tourism);
  const results = procResults(events, cultureBudget, revitalization, intermediate);

  return {
    intermediate,
    results,
  };
}