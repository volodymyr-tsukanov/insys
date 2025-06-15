using System.IO;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;


namespace IS_Lab2_YAML
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("hey, it's me - C#!");

            // Example configuration data, this should be replaced with actual configuration data.
            var confdata = new Dictionary<string, dynamic>
            {
                { "serialization", new Dictionary<string, dynamic>
                    {
                        { "source_type", "file" },
                        { "operation_order", new List<string> { "deserialize_json", "serialize_json", "convert_json_to_yaml" } },
                        { "paths", new Dictionary<string, string>
                            {
                                { "source_folder", "./" },
                                { "json_source_file", "source.json" },
                                { "json_destination_file", "destination.json" },
                                { "yaml_destination_file", "destination.yaml" }
                            }
                        }
                    }
                }
            };

            var newDeserializator = InitializeSource(confdata["serialization"]["source_type"], confdata);

            ExecuteOperations(confdata["serialization"]["operation_order"], newDeserializator, confdata);
        }


        // Initialize the source based on the source type
        private static IDeserialize InitializeSource(string sourceType, dynamic confdata)
        {
            IDeserialize newDeserializator;
            if (sourceType == "file")
            {
                string jsonFilePath = confdata["paths"]["source_folder"] + confdata["paths"]["json_source_file"];
                newDeserializator = new DeserializeJson(jsonFilePath);
            }
            else if (sourceType == "object")
            {
                newDeserializator = new SomeObjectData(); // Placeholder for other source types
            }
            else
            {
                throw new ArgumentException($"Invalid source type: {sourceType}");
            }

            return newDeserializator;
        }

        // Execute operations based on the list of operations
        private static void ExecuteOperations(List<string> operations, IDeserialize newDeserializator, dynamic confdata)
        {
            foreach (var operation in operations)
            {
                if (operation == "deserialize_json")
                {
                    Console.WriteLine("Executing: Deserialize JSON");
                    newDeserializator.SomeStats();
                }
                else if (operation == "serialize_json")
                {
                    Console.WriteLine("Executing: Serialize JSON");
                    string jsonDestFile = confdata["paths"]["source_folder"] + confdata["paths"]["json_destination_file"];
                    SerializeJson.Run(newDeserializator, jsonDestFile);
                }
                else if (operation == "convert_json_to_yaml")
                {
                    Console.WriteLine("Executing: Convert JSON to YAML");
                    string yamlDestFile = confdata["paths"]["source_folder"] + confdata["paths"]["yaml_destination_file"];
                    ConvertJsonToYaml.Run(newDeserializator, yamlDestFile);
                }
                else
                {
                    Console.WriteLine($"Unknown operation: {operation}");
                }
            }
        }

        // Interface for deserialization operations
        internal interface IDeserialize
        {
            void SomeStats();
        }

        // Deserialize JSON
        internal class DeserializeJson : IDeserialize
        {
            public List<Dictionary<string, string>> Data { get; private set; }

            public DeserializeJson(string filename)
            {
                Console.WriteLine("let's deserialize something");
                string json = File.ReadAllText(filename);
                Data = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(json);
            }

            // Sample stats
            public void SomeStats()
            {
                int exampleStat = 0;
                foreach (var dep in Data)
                {
                    if (dep["typ_JST"] == "GM" && dep["Województwo"] == "dolnośląskie")
                    {
                        exampleStat++;
                    }
                }

                Console.WriteLine($"Number of municipal offices in the Dolnośląskie province: {exampleStat}");
            }
        }

        // Convert JSON to YAML
        internal class ConvertJsonToYaml
        {
            public static void Run(IDeserialize deserializedData, string destinationFileLocation)
            {
                Console.WriteLine("let's convert something");
                var serializer = new SerializerBuilder()
                    .WithNamingConvention(CamelCaseNamingConvention.Instance)
                    .Build();
                string yamlContent = serializer.Serialize(deserializedData);
                File.WriteAllText(destinationFileLocation, yamlContent);
                Console.WriteLine("It is done");
            }
        }

        // Serialize JSON
        internal class SerializeJson
        {
            public static void Run(IDeserialize deserializedData, string fileLocation)
            {
                Console.WriteLine("let's serialize something");
                var list = new List<Dictionary<string, string>>();

                foreach (var dep in deserializedData.Data)
                {
                    var department = new Dictionary<string, string>
                    {
                        { "Kod_TERYT", dep.GetValueOrDefault("Kod_TERYT", "") },
                        { "Województwo", dep.GetValueOrDefault("Województwo", "") },
                        { "Powiat", dep.GetValueOrDefault("Powiat", "") },
                        { "typ_JST", dep.GetValueOrDefault("typ_JST", "") },
                        { "nazwa_urzędu_JST", dep.GetValueOrDefault("nazwa_urzędu_JST", "") },
                        { "miejscowość", dep.GetValueOrDefault("miejscowość", "") },
                        { "telefon_z_numerem_kierunkowym", dep.GetValueOrDefault("telefon", "") + dep.GetValueOrDefault("numer_kierunkowy", "") }
                    };

                    list.Add(department);
                }

                var jsonTemp = new { departaments = list };
                string jsonContent = JsonSerializer.Serialize(jsonTemp, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(fileLocation, jsonContent);
            }
        }

        // Some object data placeholder for other source types
        internal class SomeObjectData : IDeserialize
        {
            public void SomeStats()
            {
                Console.WriteLine("SomeObjectData stats are being calculated...");
            }
        }
    }
}
