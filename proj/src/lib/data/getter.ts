/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { CMainDatasets, IDatasetCultureBudget, IDatasetRevitalization } from "../consts";
import { fetchMainDataset } from "../fetcher";
import { csv2json, string2number } from "./convert";

const NAMESPACE = 'data::getter:';


export class InlineError extends Error {
  static CAUSE = 'ECInline';
  name: string;
  constructor(message: string) {
    super(NAMESPACE + message, { cause: InlineError.CAUSE });
    this.name = 'InlineError';
  }
}


export async function getMainCultureBudget(): Promise<IDatasetCultureBudget> {
  const fetched = await fetchMainDataset(CMainDatasets.cultureBudget);
  const rawData = csv2json(fetched.data);

  let totalSpendingKey: string | undefined;
  let perCapitaSpendingKey: string | undefined;
  let budgetShareKey: string | undefined;

  // Find correct keys based on partial string match
  for (const key of Object.keys(rawData)) {
    if (key.toLowerCase().includes("ogółem")) totalSpendingKey = key;
    else if (key.toLowerCase().includes("mieszkańca")) perCapitaSpendingKey = key;
    else if (key.toLowerCase().includes("strukturze wydatków") && key.toLowerCase().includes("%")) budgetShareKey = key;
  }
  if (!totalSpendingKey || !perCapitaSpendingKey || !budgetShareKey)
    throw new InlineError(`getMainCultureBudget some key not matches in ${JSON.stringify(rawData)}`);

  const totalSpending: Record<string, number> = {};
  const perCapitaSpending: Record<string, number> = {};
  const budgetShare: Record<string, number> = {};

  for (const year in rawData[totalSpendingKey]) {
    totalSpending[year] = string2number(rawData[totalSpendingKey][year], 'integer');
    perCapitaSpending[year] = string2number(rawData[perCapitaSpendingKey][year], 'decimal');
    budgetShare[year] = string2number(rawData[budgetShareKey][year], 'decimal');
  }

  return {
    totalSpending,
    perCapitaSpending,
    budgetShare
  };
}

export async function getMainRevitalization(): Promise<IDatasetRevitalization> {
  const fetched = await fetchMainDataset(CMainDatasets.revitalization);
  const rawData = csv2json(fetched.data);

  let plannedKey: string | undefined;
  let completedKey: string | undefined;
  let flatsKey: string | undefined;
  let costKey: string | undefined;

  for (const key of Object.keys(rawData)) {
    if (key.toLowerCase().includes(" realizowanych projektów")) plannedKey = key;
    else if (key.toLowerCase().includes("zrealizowanych projektów")) completedKey = key;
    else if (key.toLowerCase().includes("lokali komunalnych w obszarze")) flatsKey = key;
    else if (key.toLowerCase().includes("koszt remontów") && key.toLowerCase().includes("mln zł")) costKey = key;
  }
  if (!plannedKey || !completedKey || !flatsKey || !costKey)
    throw new InlineError(`getMainRevitalization some key not matches in ${JSON.stringify(rawData)}`);

  const plannedProjects: Record<string, number> = {};
  const completedProjects: Record<string, number> = {};
  const renovatedFlats: Record<string, number> = {};
  const renovationCostMln: Record<string, number> = {};

  for (const year in rawData[plannedKey]) {
    plannedProjects[year] = string2number(rawData[plannedKey][year], 'integer');
    completedProjects[year] = string2number(rawData[completedKey][year], 'integer');
    renovatedFlats[year] = string2number(rawData[flatsKey][year], 'integer');
    renovationCostMln[year] = string2number(rawData[costKey][year], 'decimal');
  }

  return {
    plannedProjects,
    completedProjects,
    renovatedFlats,
    renovationCostMln
  };
}