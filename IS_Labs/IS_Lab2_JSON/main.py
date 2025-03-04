print("hey, it's me - Python!")


import yaml
tempconffile = open('Assets/basic_config.yaml',encoding="utf8")
confdata = yaml.load(tempconffile, Loader=yaml.FullLoader)



from deserialize_json import DeserializeJson

newDeserializator = DeserializeJson(confdata['paths']['source_folder']+confdata['paths']['json_source_file'])
newDeserializator.somestats()


from serialize_json import SerializeJson
SerializeJson.run(newDeserializator, confdata['paths']['source_folder']+confdata['paths']['json_destination_file'])


from convert_json_to_yaml import ConvertJsonToYaml
ConvertJsonToYaml.run(newDeserializator,confdata['paths']['source_folder']+confdata['paths']['yaml_destination_file'])
