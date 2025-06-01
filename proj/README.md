# ?proj name
?description

## Setup (how that was done)
```bash
cd proj
podman run -it --rm --name nj --volume .:/home/app -p 127.0.0.1:3004:3004 localhost/simple-nodejs:alpha ash
```
inside _nj_
```sh
npx create-next-app@latest .
# 15.3.2
```


## Start
```bash
podman-compose up -d
```

## Sources
### Main Dataset
#### info
| | |
| :-: | :- |
| **Format** | text/csv |
| **Dates overlay** | 2020-21 |

#### links
- [Program rewitalizacji Lublina](https://dane.gov.pl/pl/dataset/3717,program-rewitalizacji-dla-lublina-na-lata-2017-2023/resource/54913/table)
  + **2017-21**
  + liczby realizowanych projektów
  + koszt w mln zł (decimal separator is ',')
  + _CMainDataset.revitalization_

---

- [Strategia rozwoju turystyki Lublina](https://dane.gov.pl/pl/dataset/3718,strategia-rozwoju-turystyki-miasta-lublin-do-roku-2025/resource/54916/table)
  + **2018-21**
  + liczby turystów
  + wydatki budżetu na upowszechnianie turystyki (decimal separator is ',')
  + Imperfections:
    - has columns with "b.d." = no data
    - some numbers contain " "
  + _CMainDataset.tourism_

---

- [Instytucje kultury w Lublinie](https://dane.gov.pl/pl/dataset/3643,c-3-1-instytucje-kultury-w-lublinie/resource/54739/table)
  + **2020-23**
  + liczba bibliotek, muzea, klubów
  + _CMainDataset.cultureInstitutions_
  + Imperfections:
    - has typo in "bib_**i**_lioteki"

---

- [Wydatki na kulturę Lublin](https://dane.gov.pl/pl/dataset/3701,d-1-4-wydatki-na-kulture-w-przeliczeniu-na-jednego-mieszkanca/resource/54866/table)
  + **2020-23**
  + w zł, na 1 mieszkańca (**allows to calculate approx. number of the city residents**), w % ogólnego budżetu miasta
  + _CMainDataset.cultureBudget_

---

- **Strategia rozwoju kultury Lublina**
  [p1](https://dane.gov.pl/pl/dataset/3740,strategia-rozwoju-kultury-lublina-na-lata-2013-2020/resource/54959/table)
  [p2](https://dane.gov.pl/pl/dataset/3712,d-1-2-liczba-uczestnikow-wybranych-wydarzen-kulturalnych-oraz-imprez-artystyczno/resource/54895/table)
  + **2015-23**
  + liczba (approx.) uczęstników wydarzeń
  + w relacji do liczby mieszkańców (**allows to calculate approx. number of the city residents**)
  + _CMainDataset.events{1,2}_

### Additional Dataset
#### info
| | |
| :-: | :- |
| **Format** | application/json |

#### links
- [Public holidays](https://date.nager.at/)


## Results
### 📊 1. Culture Spending Share Change
**Source:** `IDatasetCultureBudget.spendingShare`
**Purpose:** Show how the **share of cultural spending** changed **year over year**.
- Formula: `change[year] = spendingShare[year] - spendingShare[previousYear]`
- Insight: Reveals political or budgetary shifts in city priorities.

---

### 🧑‍🤝‍🧑 2. Event Participation per Citizen
- **Sources:**
  + `IDatasetEvents.participationByFestival`
  + `IDatasetIntermediate.estimatedCitizens`
- Formula: For each year:
  `sum(all festival participants) / estimatedCitizens[year]`
- Insight: Tracks cultural **engagement** level relative to population.

---

### 🎥 3. Institutions per Citizen
- **Sources:**
  + `IDatasetCultureInstitutions`
  + `IDatasetIntermediate.estimatedCitizens`
- Example metric:
  `librariesPer10k = (publicLibraries[year] / estimatedCitizens[year]) * 10000`
- Insight: Infrastructure availability — helps normalize for population growth.

---

### 🌍 4. Tourists per Citizen
- **Sources:**
  + `IDatasetTourism.tourists`
  + `IDatasetIntermediate.estimatedCitizens`
- Formula:
  `ratio[year] = tourists[year] / estimatedCitizens[year]`
- Insight: Indicates tourism saturation or growth potential.

---

### 🧾 5. Cost per Participant (Event Efficiency)
- **Sources:**
  + `IDatasetEvents.spending`
  + `IDatasetEvents.participationByFestival` (summed)
- Formula:
  `costPerParticipant[year] = spending[year] / totalParticipants[year`
- Insight: Evaluates whether event spending is efficient or excessive.

### 🏗️ 6. Projects Completed Ratio (Revitalization)
**Source:** `IDatasetRevitalization`
- Compare planned vs completed projects:
  `ratio[year] = completed[year] / planned[year]`
- Insight: Track effectiveness in revitalization execution.

---

### 🏛️ 7. Cultural Events Budget Share
- **Sources:**
  + `IDatasetEvents.spending` (in **mln zł**)
  + `IDatasetCultureBudget.totalSpending`
- Formula:
  `eventBudgetShare[year] = (eventsSpending[year] * 1_000_000) / totalSpending[year]`
- Insight: Measures what **portion of the total culture budget** is allocated specifically to **cultural events**, helping identify:
  + Overspending or underspending on events
  + Shifts in policy from infrastructure/support to engagement/celebration
