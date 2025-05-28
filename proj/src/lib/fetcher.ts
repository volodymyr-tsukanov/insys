/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { EDatasetType, IDataset } from "./consts"


export class FetchError extends Error {
  static CAUSE = 'ECFetch';
  name: string;
  constructor(message: string) {
    super(message, { cause: FetchError.CAUSE });
    this.name = 'FetchError';
  }
}


async function fetchRequest(url: string, options?: { method: 'GET' | 'POST', cache: 'no-cache' | 'force-cache' | 'no-store' }): Promise<Response> {
  const method = options?.method ?? 'GET';
  const response = await fetch(url, { method: method, cache: options?.cache ?? 'no-cache' });
  if (!response.ok) throw new FetchError(`failed ${method} from ${url} with status ${response.status}`);
  return response;
}

/** 
 * **Main Dataset**(D1) from https://dane.gov.pl/ \
 * useful headers: **last-modified** | **etag** ("1665564760.04-429")
 */
export async function fetchD1Csv(): Promise<IDataset> {
  const resp = await fetchRequest('https://otwartedane.lublin.eu/dataset/6f9a08f3-6d5c-4542-b80d-1aeb403d5243/resource/201c3188-e03a-4dee-83ab-dece8d532cfa/download/program-rewitalizacji-dla-lublina-na-lata-20172023.csv');
  const respBlob = await resp.blob();
  if (respBlob.type != EDatasetType.csv)
    throw new FetchError(`fetchD1 is! CSV (${respBlob.type})`);
  const textCsv = await respBlob.text();
  if (!textCsv || textCsv.length < 3)
    throw new FetchError(`fetchD1 CSV is too small (${textCsv})`);
  const modifiedDate = resp.headers.get("last-modified");
  const etag = resp.headers.get("etag");
  return {
    contentType: EDatasetType.csv,
    data: textCsv,
    fetchDate: new Date(resp.headers.get("date")!),
    modifiedDate: modifiedDate ? new Date(modifiedDate) : undefined,
    etag: etag ? etag : undefined
  };
}