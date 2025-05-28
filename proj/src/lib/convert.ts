/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { XMLBuilder } from "fast-xml-parser";
import * as yaml from "js-yaml";

const NAMESPACE = 'convert';


/** uses _parseInt parseFloat_, handles imperfections
 * @returns NaN on exception */
export function string2number(numString: string, type: 'integer' | 'decimal'): number {
  if (!numString || numString.length === 0) return NaN;
  switch (type) {
    case "integer":
      const filteredInt = numString.replaceAll(/[\s,\.]/g, '');
      return parseInt(filteredInt);
    case "decimal":
      const filteredFloat = numString.replaceAll(' ', '').replace(',', '.');
      return parseFloat(filteredFloat);
  }
}


interface CSVHeader { separator: string, columnNames: string[] };
const CSV_SEPARATORS = [',', ';', ' ', ':', '|'];
function splitCsvRow(row: string, separator: string): string[] {
  const columns: string[] = [];
  const regexp = new RegExp(`"([^"]*)"|([^${separator}]+)`, 'g'); //! regex doesn't fully comply with RFC 4180, the CSV spec (unable to parse double escape quotes like `"He said ""hello"""`)
  let match: RegExpExecArray | null;
  const filteredRow = row.replaceAll(separator+separator,separator+' '+separator);
  while ((match = regexp.exec(filteredRow)) !== null) {
    const value = match[1] ?? match[2] ?? '';
    columns.push(value);
  }
  return columns;
}
function findCsvSeparator(headRow: string): CSVHeader {
  let separator: string | undefined;
  let columnNames: string[];
  for (const sptr of CSV_SEPARATORS) {
    columnNames = splitCsvRow(headRow, sptr);
    if (columnNames.length > 1) {
      separator = sptr;
      break;
    }
  }
  if (separator === undefined)
    throw SyntaxError(`${NAMESPACE}::csv header unseparable`);
  return { separator: separator, columnNames: columnNames };
}
function parseCsvRow(row: string, header: CSVHeader, jsonObj: any) {
  if (row.length < header.columnNames.length) return;
  const columns = splitCsvRow(row, header.separator);
  if (columns.length !== header.columnNames.length)
    console.warn(`${NAMESPACE}::csv row structure differs from header (${columns.length}!=${header.columnNames.length})`);
  const [key, ...values] = columns;
  let i = 1;
  jsonObj[key] = {};
  for (const value of values) {
    jsonObj[key][header.columnNames[i++]] = value;
  }
}
export function csv2json(csvString: string): any {
  const jsonObj: any = {};
  const rows = csvString.split(/\r\n|\r|\n/);
  try {
    const header = findCsvSeparator(rows[0]);
    const innerObj = {};
    for (let i = 1; i < rows.length; i++) parseCsvRow(rows[i], header, innerObj);
    jsonObj[header.columnNames[0]] = innerObj;
  } catch (err) {
    console.error(err);
  }
  return jsonObj;
}


export function json2xml(jsonObj: any, options?: { format: boolean }): string {
  const builder = new XMLBuilder({ format: options?.format });
  return builder.build(jsonObj);
}


export function json2yaml(jsonObj: any): string {
  return yaml.dump(jsonObj);
}
