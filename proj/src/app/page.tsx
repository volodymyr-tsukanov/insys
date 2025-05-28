import { csv2json, json2xml, json2yaml } from "@/lib/convert";
import { fetchD1Csv } from "@/lib/fetcher";


export default async function Home() {
  const csvDataset = await fetchD1Csv();
  const jObj = csv2json(csvDataset.data);
  console.log(jObj);
  const xData = json2xml(jObj);
  const yData = json2yaml(jObj);

  return (
    <>
      <h1>InSys proj</h1>
      {csvDataset.data} <br/>
      {JSON.stringify(jObj,null,2)} <br/>
      {xData} <br/>
      {yData} <br/>
    </>
  );
}
