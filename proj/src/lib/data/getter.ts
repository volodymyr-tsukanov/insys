/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { CMainDatasets, COddDatasets, CYearRange, IDatasetCultureBudget, IDatasetCultureInstitutions, IDatasetEvents, IDatasetHolidays, IDatasetRevitalization, IDatasetTourism } from "../consts";
import { fetchMainDataset, fetchOddDataset } from "../fetcher";
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


// MAIN DATASETS
export async function getMainCultureBudget(): Promise<IDatasetCultureBudget> {
  const fetched = await fetchMainDataset(CMainDatasets.cultureBudget);
  const rawData = csv2json(fetched.data);

  let totalSpendingKey: string | undefined;
  let perCapitaSpendingKey: string | undefined;
  let budgetShareKey: string | undefined;

  // Find correct keys based on partial string match
  for (const key of Object.keys(rawData)) {
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes("ogółem")) totalSpendingKey = key;
    else if (filteredKey.includes("mieszkańca")) perCapitaSpendingKey = key;
    else if (filteredKey.includes("strukturze wydatków") && key.toLowerCase().includes("%")) budgetShareKey = key;
    else console.warn(`getMainCultureBudget ${filteredKey}`);
  }
  if (!totalSpendingKey || !perCapitaSpendingKey || !budgetShareKey)
    throw new InlineError(`getMainCultureBudget some keys not match`);

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
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes(" realizowanych projektów")) plannedKey = key;
    else if (filteredKey.includes("zrealizowanych projektów")) completedKey = key;
    else if (filteredKey.includes("lokali komunalnych w obszarze")) flatsKey = key;
    else if (filteredKey.includes("koszt remontów") && filteredKey.includes("mln zł")) costKey = key;
    else console.warn(`getMainRevitalization ${filteredKey}`);
  }
  if (!plannedKey || !completedKey || !flatsKey || !costKey)
    throw new InlineError(`getMainRevitalization some keys not match`);

  const projectsPlanned: Record<string, number> = {};
  const projectsCompleted: Record<string, number> = {};
  const renovatedFlats: Record<string, number> = {};
  const renovationCostMln: Record<string, number> = {};

  for (const year in rawData[plannedKey]) {
    projectsPlanned[year] = string2number(rawData[plannedKey][year], 'integer');
    projectsCompleted[year] = string2number(rawData[completedKey][year], 'integer');
    renovatedFlats[year] = string2number(rawData[flatsKey][year], 'integer');
    renovationCostMln[year] = string2number(rawData[costKey][year], 'decimal');
  }

  return {
    projectsPlanned,
    projectsCompleted,
    renovatedFlats,
    renovationCostMln
  };
}

export async function getMainTourism(): Promise<IDatasetTourism> {
  const fetched = await fetchMainDataset(CMainDatasets.tourism);
  const rawData = csv2json(fetched.data);

  let totalVisitorsKey: string | undefined;
  let touristsKey: string | undefined;
  let infoCenterKey: string | undefined;
  let foreignKey: string | undefined;
  let budgetKey: string | undefined;

  for (const key of Object.keys(rawData)) {
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes("osób odwiedzających")) totalVisitorsKey = key;
    else if (filteredKey.includes("turystów w lublinie")) touristsKey = key;
    else if (filteredKey.includes("informacji turystycznej")) infoCenterKey = key;
    else if (filteredKey.includes("zagranicznych w og")) foreignKey = key;
    else if (filteredKey.includes("upowszechniania")) budgetKey = key;
    else console.warn(`getMainTourism ${filteredKey}`);
  }
  if (!totalVisitorsKey || !touristsKey || !infoCenterKey || !foreignKey || !budgetKey)
    throw new InlineError(`getMainTourism some keys not match`);

  const totalVisitors: Record<string, number> = {};
  const tourists: Record<string, number> = {};
  const infoCenterVisitors: Record<string, number> = {};
  const foreignTourists: Record<string, number> = {};
  const tourismBudget: Record<string, number> = {};

  for (const year in rawData[totalVisitorsKey]) {
    let v = string2number(rawData[totalVisitorsKey][year], 'integer');
    if (v != null && !Number.isNaN(v)) totalVisitors[year] = v;
    tourists[year] = string2number(rawData[touristsKey][year], 'integer');
    v = string2number(rawData[infoCenterKey][year], 'integer');
    if (v != null && !Number.isNaN(v)) infoCenterVisitors[year] = v;
    foreignTourists[year] = string2number(rawData[foreignKey][year], 'integer');
    tourismBudget[year] = string2number(rawData[budgetKey][year], 'decimal');
  }

  return {
    totalVisitors,
    tourists,
    infoCenterVisitors,
    foreignTourists,
    tourismBudget
  };
}

export async function getMainEvents(): Promise<IDatasetEvents> {
  const [fetched1, fetched2] = await Promise.all([
    fetchMainDataset(CMainDatasets.events1),
    fetchMainDataset(CMainDatasets.events2),
  ]);
  const raw1 = csv2json(fetched1.data);
  const raw2 = csv2json(fetched2.data);

  let spendingKey: string | undefined;
  let spendingShareKey: string | undefined;

  const participationByFestival: Record<string, Record<string, number>> = {};
  const spendingMln: Record<string, number> = {};
  const spendingShare: Record<string, number> = {};
  const participantsPerCapita: Record<string, number> = {};

  // --- Normalize utility ---
  const normalizeFestivalKey = (key: string): string =>
    key.replace(/^Liczba uczestników imprez kulturalnych, w ramach:\s*/i, '')
      .replace(/Międzynarodowy Festiwal/i, 'Festiwal')
      .replace(/Festiwal(?:u)?\s*/i, 'Festiwal ')
      .replace(/„|”|’|'|ʼ|"|\*/g, '')
      .replace(/–|—/g, '-') // normalize dashes
      .replace(/\s+/g, ' ') // normalize spaces
      .trim();

  // --- Process events1 ---
  for (const key of Object.keys(raw1)) {
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes("wydatki miasta na kulturę")) {
      spendingKey = key;
    } else if (filteredKey.includes("udział wydatków na kulturę")) {
      spendingShareKey = key;
    } else if (filteredKey.includes("uczestników imprez")) {
      const normalized = normalizeFestivalKey(key);
      participationByFestival[normalized] = {};
      for (const year in raw1[key]) {
        const v = string2number(raw1[key][year], 'integer');
        if (v != null && !Number.isNaN(v)) {
          participationByFestival[normalized][year] = v;
        }
      }
    } else {
      console.warn(`getMainEvents (events1): unknown key: ${filteredKey}`);
    }
  }
  if (!spendingKey || !spendingShareKey)
    throw new InlineError(`getMainEvents: some keys not match`);
  for (const year in raw1[spendingKey]) {
    spendingMln[year] = string2number(raw1[spendingKey][year], 'decimal');
    spendingShare[year] = string2number(raw1[spendingShareKey][year], 'decimal');
  }
  // --- Process events2 ---
  for (const key of Object.keys(raw2)) {
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes("uczestników w relacji")) {
      for (const year in raw2[key]) {
        participantsPerCapita[year] = string2number(raw2[key][year], 'decimal');
      }
    } else if (filteredKey !== "column_header") {
      const normalized = normalizeFestivalKey(key);
      if (!participationByFestival[normalized]) {
        participationByFestival[normalized] = {};
      }
      for (const year in raw2[key]) {
        const v = string2number(raw2[key][year], 'integer');
        if (v != null && !Number.isNaN(v)) {
          // Override or set data from raw2 (assumed newer/more complete)
          participationByFestival[normalized][year] = v;
        }
      }
    }
  }

  return {
    spendingMln,
    spendingShare,
    participationByFestival,
    participantsPerCapita,
  };
}

export async function getMainCultureInstitutions(): Promise<IDatasetCultureInstitutions> {
  const fetched = await fetchMainDataset(CMainDatasets.cultureInstitutions);
  const rawData = csv2json(fetched.data);

  let librariesKey: string | undefined;
  let centersKey: string | undefined;
  let cinemasKey: string | undefined;
  let museumsKey: string | undefined;

  for (const key of Object.keys(rawData)) {
    const filteredKey = key.toLowerCase();
    if (filteredKey.includes("bib") && filteredKey.includes("oteki")) librariesKey = key;
    else if (filteredKey.includes("domy") || filteredKey.includes("ośrodki")) centersKey = key;
    else if (filteredKey.includes("kina")) cinemasKey = key;
    else if (filteredKey.includes("muzea")) museumsKey = key;
    else console.warn(`getMainCultureInstitutions unknown key: ${filteredKey}`);
  }
  if (!librariesKey || !centersKey || !cinemasKey || !museumsKey)
    throw new InlineError(`getMainCultureInstitutions some keys not match`);

  const publicLibraries: Record<string, number> = {};
  const cultureCenters: Record<string, number> = {};
  const cinemas: Record<string, number> = {};
  const museums: Record<string, number> = {};

  for (const year in rawData[librariesKey]) {
    publicLibraries[year] = string2number(rawData[librariesKey][year], 'integer');
    cultureCenters[year] = string2number(rawData[centersKey][year], 'integer');
    cinemas[year] = string2number(rawData[cinemasKey][year], 'integer');
    museums[year] = string2number(rawData[museumsKey][year], 'integer');
  }

  return {
    publicLibraries,
    cultureCenters,
    cinemas,
    museums,
  };
}


// ODD DATASETS
export async function getOddHolidays(year: number): Promise<IDatasetHolidays[]> {
  const fetched = await fetchOddDataset(COddDatasets.holidays.replace('$', year.toFixed(0)));
  const rawData = JSON.parse(fetched.data);

  if (!Array.isArray(rawData))
    throw new InlineError("getOddHolidays expected an array");

  return rawData.map((item): IDatasetHolidays => ({
    date: item.date,
    localName: item.localName,
    name: item.name,
    countryCode: item.countryCode,
    fixed: Boolean(item.fixed),
    global: Boolean(item.global),
    counties: item.counties ?? null,
    launchYear: item.launchYear ?? null,
    types: Array.isArray(item.types) ? item.types : [],
  }));
}


// ALL
export async function getAllDatasets(): Promise<{
  cultureBudget: IDatasetCultureBudget;
  revitalization: IDatasetRevitalization;
  tourism: IDatasetTourism;
  events: IDatasetEvents;
  cultureInstitutions: IDatasetCultureInstitutions;
  holidays: { [year: string]: IDatasetHolidays[] };
}> {
  const [
    cultureBudget,
    revitalization,
    tourism,
    events,
    cultureInstitutions,
  ] = await Promise.all([
    getMainCultureBudget(),
    getMainRevitalization(),
    getMainTourism(),
    getMainEvents(),
    getMainCultureInstitutions(),
  ]);

  const holidays: { [year: string]: IDatasetHolidays[] } = {};

  for (const year of CYearRange) {
    holidays[year.toFixed(0)] = await getOddHolidays(year);
  }

  return {
    cultureBudget,
    revitalization,
    tourism,
    events,
    cultureInstitutions,
    holidays,
  };
}
