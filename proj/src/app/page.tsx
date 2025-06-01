import { CMainDatasets, COddDatasets } from "@/lib/consts";
import { csv2json, json2xml, json2yaml } from "@/lib/data/convert";
import { getMainCultureBudget, getMainCultureInstitutions, getMainEvents, getMainRevitalization, getMainTourism, getOddHolidays } from "@/lib/data/getter";
import { fetchMainDataset, fetchOddDataset } from "@/lib/fetcher";


export default async function Home() {
  /*const tmp = await fetchOddDataset(COddDatasets.holidays.replace('$','2020'));
  console.log(JSON.parse(tmp.data));*/
  /*const ds = await getOddHolidays(2020);
  console.log(ds);*/

  return (
    <>
      <h1>InSys proj</h1>
    </>
  );
}
