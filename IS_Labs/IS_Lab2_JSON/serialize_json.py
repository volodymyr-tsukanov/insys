# -*- coding: utf-8 -*-
"""
serialize json
"""
import json
class SerializeJson:
    #metoda statyczna
    @staticmethod
    def run(deserializeddata, filelocation):
        print("let's serialize something")
        lst = []

        for dep in deserializeddata.data:
            department = {
                "Kod_TERYT": dep.get('Kod_TERYT', ''),
                "Województwo": dep.get('Województwo', ''),
                "Powiat": dep.get('Powiat', ''),
                "typ_JST": dep.get('typ_JST', ''),
                "nazwa_urzędu_JST": dep.get('nazwa_urzędu_JST', ''),
                "miejscowość": dep.get('miejscowość', ''),
                # check if both 'telefon' and 'numer_kierunkowy' exist
                #"telefon_z_numerem_kierunkowym": dep.get('telefon', '') + dep.get('numer_kierunkowy', '')
            }
            lst.append(department)

        jsontemp = {"departaments":lst}

        with open(filelocation, 'w',encoding='utf-8') as f:
            json.dump(jsontemp, f, ensure_ascii=False)
