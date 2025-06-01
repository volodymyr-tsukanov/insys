import { CMainDatasets, COddDatasets } from "@/lib/consts";
import { csv2json, json2xml, json2yaml } from "@/lib/data/convert";
import { getMainCultureBudget, getMainRevitalization } from "@/lib/data/getter";
import { fetchMainDataset, fetchOddDataset } from "@/lib/fetcher";


export default async function Home() {
  /*const tmp = await fetchMainDataset(CMainDatasets.revitalization);
  console.log(csv2json(tmp.data));*/
  const ds = await getMainRevitalization();
  console.log(ds);

  return (
    <>
      <h1>InSys proj</h1>
    </>
  );
}
