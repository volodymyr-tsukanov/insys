# -*- coding: utf-8 -*-
"""
deserialize json
"""
import json
class DeserializeJson:
    # konstruktor
    def __init__(self, filename):
        print("let's deserialize something")
        tempdata = open(filename, encoding="utf8")
        self.data = json.load(tempdata)

    # przykładowe statystyki
    def somestats(self):
        example_stat = 0
        for dep in self.data:
            if dep['typ_JST'] == 'GM' and dep['Województwo'] == 'dolnośląskie':
                example_stat += 1

        print('liczba urzędów miejskich w województwie dolnośląskim: ' + ' ' + str(example_stat))
