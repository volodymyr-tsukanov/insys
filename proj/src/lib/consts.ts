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
  data: string;
  fetchDate: Date;
  modifiedDate?: Date;
  etag?: string;
};