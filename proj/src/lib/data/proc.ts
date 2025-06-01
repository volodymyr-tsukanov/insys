/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
const NAMESPACE = 'data::proc:';


export class ProcError extends Error {
  static CAUSE = 'ECProc';
  name: string;
  constructor(message: string) {
    super(NAMESPACE + message, { cause: ProcError.CAUSE });
    this.name = 'ProcError';
  }
}

/*
/// **jsonObj** = _CMainDatasets.cultureBudget_
export function procCalculatePopulationSize(cultureBudgetObj: any): IDatasetPopulation {
  if (!cultureBudgetObj) throw new ProcError('empty input data');
  const res: IDatasetPopulation = {
    years: [], residentNumbers: []
  };
  const keys = Object.keys(cultureBudgetObj);
  const spentOverall = cultureBudgetObj[keys[0]];
  const spentI1Resident = cultureBudgetObj[keys[1]];
  for (const key in spentOverall) {
    const spentValue = string2number(spentOverall[key], 'integer');
    const si1rValue = string2number(spentI1Resident[key], 'decimal');
    if (Number.isNaN(spentValue) || Number.isNaN(si1rValue)) {
      console.warn(`${NAMESPACE} invalid input data ${spentOverall[key]} | ${spentI1Resident[key]}`)
      continue;
    }
    res.years.push(string2number(key, 'decimal'));
    res.residentNumbers.push((spentOverall / spentI1Resident));
  }
  return res;
}

export function procCalculatePopulationSize(jsonObj: any): IDatasetPopulation {
  if (!jsonObj) throw new ProcError('empty input data');
  const res: IDatasetPopulation = {
    years: [], residentNumbers: []
  };
  const keys = Object.keys(jsonObj);
  const spentOverall = jsonObj[keys[0]];
  const spentI1Resident = jsonObj[keys[1]];
  for (const key in spentOverall) {
    const spentValue = string2number(spentOverall[key], 'integer');
    const si1rValue = string2number(spentI1Resident[key], 'decimal');
    if (Number.isNaN(spentValue) || Number.isNaN(si1rValue)) {
      console.warn(`${NAMESPACE} invalid input data ${spentOverall[key]} | ${spentI1Resident[key]}`)
      continue;
    }
    res.years.push(string2number(key, 'decimal'));
    res.residentNumbers.push((spentOverall / spentI1Resident));
  }
  return res;
}
  */