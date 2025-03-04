# -*- coding: utf-8 -*-
"""
json to yaml converter
"""
import json
import yaml


class ConvertJsonToYaml:
    @staticmethod
    def run(deserializeddata, destinationfilelocation):
        print("Converting deserialized data to YAML...")
        with open(destinationfilelocation, 'w', encoding='utf-8') as f:
            yaml.dump(deserializeddata, f, allow_unicode=True)
        print("Conversion complete.")

    @staticmethod
    def run_from_files(json_file_location, yaml_file_location):
        print("Reading JSON data from file...")
        with open(json_file_location, 'r', encoding='utf-8') as json_file:
            deserializeddata = json.load(json_file)

        print("Converting JSON data to YAML...")
        with open(yaml_file_location, 'w', encoding='utf-8') as yaml_file:
            yaml.dump(deserializeddata, yaml_file, allow_unicode=True)
        print("Conversion complete.")
