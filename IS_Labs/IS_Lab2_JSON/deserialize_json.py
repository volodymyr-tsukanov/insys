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
        self.data = json.load(tempdata)['data']

    # przykładowe statystyki
    def somestats(self):
        stat = {'dolnośląskie':{}, 'kujawsko-pomorskie':{}, 'lubelskie':{}, 'lubuskie':{}, 'łódzkie':{}, 'małopolskie':{}, 'mazowieckie':{}, 'opolskie':{}, 'podkarpackie':{}, 'podlaskie':{}, 'pomorskie':{}, 'śląskie':{}, 'świętokrzyskie':{}, 'warmińsko-mazurskie':{}, 'wielkopolskie':{}, 'zachodniopomorskie':{}}
        for region in stat:
            stat[region] = {'P': 0, 'GW': 0, 'GM': 0, 'GMW': 0, 'MNP': 0, 'W': 0, 'dzielnica': 0}

        print(stat.get('lubelskie'))
        for dep in self.data:
            stat.get(dep['Województwo'])[dep['typ_JST']] += 1
            #if dep['typ_JST'] == 'GM' and dep['Województwo'] == 'dolnośląskie':
            #    example_stat += 1

        print(json.dumps(stat, indent=4, ensure_ascii=False))
