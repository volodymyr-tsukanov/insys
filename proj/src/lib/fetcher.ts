/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { EDatasetType, IDataset } from "./consts"


export interface IFetchOptions {
  method: 'GET' | 'POST';
  cache: 'no-cache' | 'force-cache' | 'no-store';
};

export class FetchError extends Error {
  static CAUSE = 'ECFetch';
  name: string;
  constructor(message: string) {
    super(message, { cause: FetchError.CAUSE });
    this.name = 'FetchError';
  }
}


async function fetchRequest(url: string, options?: IFetchOptions): Promise<Response> {
  const method = options?.method ?? 'GET';
  const response = await fetch(url, { method: method, cache: options?.cache ?? 'no-cache' });
  if (!response.ok) throw new FetchError(`failed ${method} from ${url} with status ${response.status}`);
  return response;
}

/** 
 * comply with urls from **CMainDataset** \
 * useful headers: **etag** ("1665564760.04-429")
 */
export async function fetchMainDataset(url: string, options?: IFetchOptions): Promise<IDataset> {
  const resp = await fetchRequest(url, options);
  const respBlob = await resp.blob();
  if (!respBlob.type.startsWith(EDatasetType.csv))
    throw new FetchError(`fetchMD is! CSV (${respBlob.type})`);
  const textCsv = await respBlob.text();
  if (!textCsv || textCsv.length < 3)
    throw new FetchError(`fetchMD CSV is too small (${textCsv})`);
  const modifiedDate = resp.headers.get("last-modified");
  const etag = resp.headers.get("etag");
  return {
    contentType: EDatasetType.csv,
    data: textCsv,
    fetchDate: new Date(resp.headers.get("date")!),
    modifiedDate: modifiedDate ? new Date(modifiedDate) : undefined,
    tag: etag ? etag : undefined
  };
}

/** 
 * comply with urls from **COddDataset** \
 */
export async function fetchOddDataset(url: string, options?: IFetchOptions): Promise<IDataset> {
  const resp = await fetchRequest(url, options);
  const respBlob = await resp.blob();
  let respType: EDatasetType;
  if (respBlob.type.startsWith(EDatasetType.json)) respType = EDatasetType.json;
  else if (respBlob.type.startsWith(EDatasetType.xml)) respType = EDatasetType.xml;
  else if (respBlob.type.startsWith(EDatasetType.csv)) respType = EDatasetType.csv;
  else throw new FetchError(`fetchOD unknown odd dataset type ${respBlob.type}`);
  const textCsv = await respBlob.text();
  if (!textCsv || textCsv.length < 2)
    throw new FetchError(`fetchOD data is too small (${textCsv})`);
  const modifiedDate = resp.headers.get("last-modified");
  console.log(resp.headers);
  return {
    contentType: EDatasetType.csv,
    data: textCsv,
    fetchDate: new Date(resp.headers.get("date")!),
    modifiedDate: modifiedDate ? new Date(modifiedDate) : undefined,
  };
}