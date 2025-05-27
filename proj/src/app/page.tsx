import { csv2json, json2xml, json2yaml } from "@/lib/convert";


export default function Home() {
  const csv = '"hd",c1,c2\n"h1",01,02\n"h2",11,12';
  const jsonObj = csv2json(csv);
  const txt = JSON.stringify(jsonObj);
  const txml = json2xml(jsonObj);
  const tyml = json2yaml(jsonObj);
  console.log(jsonObj);

  return (
    <>
      <h1>InSys proj</h1>
      {txt} <br/>
      {txml} <br/>
      {tyml} <br/>
    </>
  );
}
