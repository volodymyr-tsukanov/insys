# -*- coding: utf-8 -*-
"""
json to yaml converter
"""
import yaml
class ConvertJsonToYaml:
    @staticmethod
    def run(deserializeddata, destinationfilelocaiton):
        print("let's convert something")
        with open(destinationfilelocaiton, 'w', encoding='utf-8') as f:
            yaml.dump(deserializeddata, f, allow_unicode=True)

        print("it is done")
