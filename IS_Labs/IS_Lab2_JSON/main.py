print("hey, it's me - Python!")

import yaml
from deserialize_json import DeserializeJson
from serialize_json import SerializeJson
from convert_json_to_yaml import ConvertJsonToYaml


# Function based on source type
def initialize_source(source_type, confdata):
    if source_type == 'file':
        from deserialize_json import DeserializeJson
        json_file_path = confdata['paths']['source_folder'] + confdata['paths']['json_source_file']
        new_deserializator = DeserializeJson(json_file_path)
    elif source_type == 'object':
        new_deserializator = SomeObjectData()  # xxample placeholder
    else:
        raise ValueError(f"Invalid source type: {source_type}")

    return new_deserializator


# Function for operation execution
def execute_operations(operations, newDeserializator, confdata):
    for operation in operations:
        if operation == 'deserialize_json':
            print("Executing: Deserialize JSON")
            newDeserializator.somestats()
        elif operation == 'serialize_json':
            print("Executing: Serialize JSON")
            from serialize_json import SerializeJson
            json_dest_file = confdata['paths']['source_folder'] + confdata['paths']['json_destination_file']
            SerializeJson.run(newDeserializator, json_dest_file)
        elif operation == 'convert_json_to_yaml':
            print("Executing: Convert JSON to YAML")
            from convert_json_to_yaml import ConvertJsonToYaml
            yaml_dest_file = confdata['paths']['source_folder'] + confdata['paths']['yaml_destination_file']
            ConvertJsonToYaml.run(newDeserializator, yaml_dest_file)
        else:
            print(f"Unknown operation: {operation}")


newDeserializator = initialize_source(confdata['serialization']['source_type'], confdata)

execute_operations(confdata['serialization']['operation_order'], newDeserializator, confdata)
