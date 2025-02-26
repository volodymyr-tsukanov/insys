using System.IO;
using System.Xml;
using System.Xml.XPath;


namespace IS_Lab1_XML
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string xmlpath = Path.Combine("Assets", "data.xml");

            // odczyt danych z wykorzystaniem DOM
            Console.WriteLine("XML loaded by DOM Approach");
            XMLReadWithDOMApproach.Read(xmlpath);
            // odczyt danych z wykorzystaniem SAX
            Console.WriteLine("XML loaded by SAX Approach");
            XMLReadWithSAXApproach.Read(xmlpath);

            // odczyt danych z wykorzystaniem XPath i DOM
            Console.WriteLine("XML loaded with XPath");
            XMLReadWithXLSTDOM.Read(xmlpath);
       
            Console.ReadLine();
        }
    }


    internal class XMLReadWithDOMApproach
    {
        static public void Read(string xmlpath)
        {
            // odczyt zawartości dokumentu
            XmlDocument doc = new XmlDocument();
            doc.Load(xmlpath);
            string postac;
            string sc;
            int count = 0;
            var drugs = doc.GetElementsByTagName("produktLeczniczy");
            Dictionary<int,int> tasamanazwa = new Dictionary<int,int>();
            Dictionary<string,List<int>> producerCounts = new Dictionary<string,List<int>>();

            foreach (XmlNode d in drugs){
                //Ile jest różnych preparatów leczniczych o takiej samie nazwie powszechnej, które występują pod więcej niż jedną postacią
                postac = d.Attributes.GetNamedItem("nazwaPostaciFarmaceutycznej").Value;
                sc = d.Attributes.GetNamedItem("nazwaPowszechnieStosowana").Value;

                if (tasamanazwa.ContainsKey(sc.GetHashCode())){
                    int hash = tasamanazwa[sc.GetHashCode()];
                    if (hash == 0) { }//skip
                    else if (hash != postac.GetHashCode())
                    {
                        tasamanazwa[sc.GetHashCode()] = 0;
                        count++;
                    }
                }else{
                    tasamanazwa.Add(sc.GetHashCode(), postac.GetHashCode());
                }

                var producers = doc.GetElementsByTagName("daneOWytworcy");
                foreach (XmlNode p in producers){
                    string country = producer.Attributes.GetNamedItem("krajWytworcyImportera").Value;
                    string name = producer.Attributes.GetNamedItem("nazwaWytworcyImportera").Value;

                    if (producerCounts.ContainsKey(country))
                    {
                        producerCounts[country].Add(name.GetHashCode());
                    }
                    else
                    {
                        producerCounts[country] = new List<int> { name.GetHashCode() };
                    }
                }

                //if (postac == "Krem" && sc == "Mometasoni furoas")
                 //   count++;
            }
            //Console.WriteLine("Liczba produktów leczniczych w postaci kremu, których jedyną substancją czynną jest Mometasoni furoas {0}", count);
            Console.WriteLine("Ile jest różnych preparatów leczniczych o takiej samie nazwie powszechnej, które występują pod więcej niż jedną postacią {0}", count);

            var sortedProducers = producerCounts.OrderByDescending(x => x.Value.Count);
            Console.WriteLine("Top5 krojow: ");
            int i5 = 0;
            foreach (var p in sortedProducers)
            {
                Console.WriteLine(" {0} = {1}",p.Key,p.Value.Count);

                if(i5<5) i5=i5+1;
                else{
                    break;
                }
            }
        }
    }

    internal class XMLReadWithSAXApproach
    {
        static public void Read(string xmlpath)
        {
            // konfiguracja początkowa dla XmlReadera
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.IgnoreComments = true;
            settings.IgnoreProcessingInstructions = true;
            settings.IgnoreWhitespace = true;
            // odczyt zawartości dokumentu
            XmlReader reader = XmlReader.Create(xmlpath, settings);
            // zmienne pomocnicze
            int count = 0;
            string postac = "";
            string sc = "";
            Dictionary<int, int> tasamanazwa = new Dictionary<int, int>();

            reader.MoveToContent();
            // analiza każdego z węzłów dokumentu
            while (reader.Read())
            {
                if (reader.NodeType == XmlNodeType.Element && reader.Name == "produktLeczniczy")
                {
                    postac = reader.GetAttribute("nazwaPostaciFarmaceutycznej");
                    sc = reader.GetAttribute("nazwaPowszechnieStosowana");

                    if (tasamanazwa.ContainsKey(sc.GetHashCode()))
                    {
                        int hash = tasamanazwa[sc.GetHashCode()];
                        if (hash == 0) { }//skip
                        else if (hash != postac.GetHashCode())
                        {
                            tasamanazwa[sc.GetHashCode()] = 0;
                            count++;
                        }
                    }
                    else
                    {
                        tasamanazwa.Add(sc.GetHashCode(), postac.GetHashCode());
                    }
                    //if (postac == "Krem" && sc == "Mometasoni furoas")
                    //   count++;
                }
            }
            Console.WriteLine("Ile jest różnych preparatów leczniczych o takiej samie nazwie powszechnej, które występują pod więcej niż jedną postacią {0}", count);
            //Console.WriteLine("Liczba produktów leczniczych w postaci {0}", count);
        }
    }

    internal class XMLReadWithXLSTDOM
    {
        static public void Read(string xmlpath)
        {
            XPathDocument document = new XPathDocument(xmlpath);
            XPathNavigator navigator = document.CreateNavigator();
            XmlNamespaceManager manager = new
            XmlNamespaceManager(navigator.NameTable);
            manager.AddNamespace("x", "http://rejestry.ezdrowie.gov.pl/rpl/eksport-danych-v5.0.0");
            XPathExpression query = navigator.Compile("/x:produktyLecznicze/x:produktLeczniczy[@postac = 'Krem' and @nazwaPowszechnieStosowana = 'Mometasonifuroas']");
            query.SetContext(manager);
            int count = navigator.Select(query).Count;
            Console.WriteLine("Liczba produktów leczniczych w postaci kremu, których jedyną substancją czynną jest Mometasoni furoas {0}", count );
        }
    }
}
