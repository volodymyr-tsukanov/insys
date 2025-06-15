using IS_Lab5_SOAPCS.ServiceReference1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IS_Lab5_SOAPCS
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("My First SOAP Client!");
            MyFirstSOAPInterfaceClient client = new
            MyFirstSOAPInterfaceClient();
            string text = await
            client.getHelloWorldAsStringAsync("Volodymyr");
            Console.WriteLine(text);
            Console.ReadLine();
        }
    }
}
