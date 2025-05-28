import { COddDatasets } from "@/lib/consts";
import { json2xml, json2yaml } from "@/lib/convert";
import { fetchOddDataset } from "@/lib/fetcher";


export default async function Home() {
  const csvDataset = await fetchOddDataset(COddDatasets.holidays.replace('$','2017'));
  const jObj = JSON.parse(csvDataset.data);
  const xData = json2xml(jObj);
  const yData = json2yaml(jObj);

  return (
    <>
      <h1>InSys proj</h1>
      {csvDataset.data} <br /><br />
      {xData} <br />
      {yData} <br />
    </>
  );
}
