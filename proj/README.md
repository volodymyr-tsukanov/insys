# InSys
The impact of budgetary spending on the cultural activity of Lublin.

---

## Setup
### Containerized setup
```bash
docker-compose up --build -d
```
### Manual installation
- Change `.env` \
from `MONGO_URI=mongodb://db:27017/insys` to `MONGO_URI=mongodb://localhost:27017/insys`

```bash
npm install && npm run dev
```

> [!IMPORTANT]
> After the setup the app can be found at `http://localhost:3004`

---
---

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

---
---

## Results
### Intermediate Metrics
#### 🧑‍🤝‍🧑 1. Event Participation per Citizen
- **Sources:**
  + `IDatasetEvents.participationByFestival`
  + `IDatasetIntermediate.estimatedCitizens`
- Formula: For each year:
  `sum(all festival participants) / estimatedCitizens[year]`
- Insight: Tracks cultural **engagement** level relative to population.

#### 🎥 2. Institutions per Citizen
- **Sources:**
  + `IDatasetCultureInstitutions`
  + `IDatasetIntermediate.estimatedCitizens`
- Example metric:
  `librariesPer10k = (publicLibraries[year] / estimatedCitizens[year]) * 10000`
- Insight: Infrastructure availability — helps normalize for population growth.

#### 🌍 3. Tourists per Citizen
- **Sources:**
  + `IDatasetTourism.tourists`
  + `IDatasetIntermediate.estimatedCitizens`
- Formula:
  `ratio[year] = tourists[year] / estimatedCitizens[year]`
- Insight: Indicates tourism saturation or growth potential.

---

### Result Metrics
#### 📊 4. Culture Spending Share Change
**Source:** `IDatasetCultureBudget.spendingShare`
**Purpose:** Show how the **share of cultural spending** changed **year over year**.
- Formula: `change[year] = spendingShare[year] - spendingShare[previousYear]`
- Insight: Reveals political or budgetary shifts in city priorities.

#### 🧾 5. Cost per Participant (Event Efficiency)
- **Sources:**
  + `IDatasetEvents.spending`
  + `IDatasetEvents.participationByFestival` (summed)
- Formula:
  `costPerParticipant[year] = spending[year] / totalParticipants[year`
- Insight: Evaluates whether event spending is efficient or excessive.

#### 🏗️ 6. Projects Completed Ratio (Revitalization)
**Source:** `IDatasetRevitalization`
- Compare planned vs completed projects:
  `ratio[year] = completed[year] / planned[year]`
- Insight: Track effectiveness in revitalization execution.

#### 🏛️ 7. Cultural Events Budget Share
- **Sources:**
  + `IDatasetEvents.spending` (in **mln zł**)
  + `IDatasetCultureBudget.totalSpending`
- Formula:
  `eventBudgetShare[year] = (eventsSpending[year] * 1_000_000) / totalSpending[year]`
- Insight: Measures what **portion of the total culture budget** is allocated specifically to **cultural events**, helping identify:
  + Overspending or underspending on events
  + Shifts in policy from infrastructure/support to engagement/celebration

---

### Final Integration Metrics
#### 📅 8. Events per Holiday
- **Sources:**
  + `IDatasetIntermediate.eventTotalParticipants`
  + `IEnrichedYear.holidayCount`
- Formula:
  `eventPerHoliday[year] = eventTotalParticipants[year] / holidayCount`
- Insight: Measures how event activity is distributed across holidays. Higher values indicate dense cultural engagement per holiday.

#### 🌍 9. Tourists per Holiday
- **Sources:**
  + `IDatasetIntermediate.touristsPerCitizen`
  + `IDatasetIntermediate.estimatedCitizens`
  + `IEnrichedYear.holidayCount`
- Formula:
  `touristsPerHoliday[year] = (touristsPerCitizen[year] * estimatedCitizens[year]) / holidayCount`
- Insight: Reflects potential for holiday-driven tourism. High values may suggest opportunities for holiday-aligned tourist programming.

#### 📊 10. Holiday Clustering Index
- **Sources:**
  + `IEnrichedYear.holidaysByMonth`
  + Derived from gaps between sorted holiday dates
- Formula:
  `holidayClusteringIndex[year] = stdDev(holidayDateGaps)`
- Insight: Evaluates how evenly holidays are spread throughout the year. Higher clustering may suggest bottlenecked cultural or economic activity.

#### 🏛️ 11. Institution to Holiday Ratio
- **Sources:**
  + `IDatasetIntermediate.institutionsPer10kCitizens`
  + `IEnrichedYear.holidayCount`
- Formula:
  `institutionToHolidayRatio[year] = (institutionsPer10kCitizens[year] * 10,000) / holidayCount`
- Insight: Indicates the availability of cultural infrastructure per holiday — useful for evaluating accessibility and planning needs.

#### 💰 12. Cost per Holiday Participant
- **Sources:**
  + `IDatasetResults.costPerEventParticipant`
  + `IEnrichedYear.eventPerHoliday`
- Formula:
  `costPerHolidayParticipant[year] = costPerEventParticipant[year] * eventPerHoliday[year]`
- Insight: Quantifies the cost efficiency of holiday-based cultural participation. Lower values suggest more cost-effective public cultural investment.

#### 📅 13. Event-Holiday Density Index
- **Sources:**
  + `CEventMonths` (event distribution by month)
  + `IEnrichedYear.holidaysByMonth`
- Formula:
  ```ts
  For each month with ≥1 holiday:
    ratio = number of events in month / holidayCount in month

  eventHolidayDensityIndex[year] = average of all such ratios
  ```
- Insight: Indicates how well events are aligned with public holidays throughout the year. Higher values reflect better use of public free time.

#### 📈 14. Event-Holiday Alignment Ratio
- **Sources:**
  + `CEventMonths`
  + `IEnrichedYear.holidaysByMonth`
- Formula:
  `eventHolidayAlignment[year] = count(monthsWithEvents ∩ monthsWithHolidays) / 12`
- Insight: Measures month-level overlap between holidays and event activity. Useful for evaluating seasonal programming alignment.
