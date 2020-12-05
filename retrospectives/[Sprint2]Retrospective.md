TEMPLATE FOR RETROSPECTIVE (Team10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

| #              | Committed | Done       |
|:--------------:|:---------:|:----------:|
|**Stories**     |     6     |    6       | 
|**Story Points**|     31    |    31      | 
|**Hours**       |     72h   |    71h     | 

<br>

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story - Horizontal Task  | # Tasks | Points | Hours est. | Hours actual |
|:--------: |:--------:|:--------:|:--------:|:--------:|
| _#0_      | 2        |    -     |   15h    | 14h      |
| _#6_      | 2        |    8     |   8h     | 11h 20m  |
| _#7_      | 2        |    3     |   2h     | 2h       |
| _#8_      | 1        |    2     |   1h     | 30m      |
| _#9_      | 1        |    5     |   1h     | 1h       |
| _#10_     | 3        |    8     |   9h     | 8h       |
| _#11_     | 2        |    5     |   7h     | 7h       |
| _Testing_ | 6        |    -     |   29h    | 27h 10m  |
| _Docker Configuration_ | 1      |    -     |   2 h    | 2h   |

   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

|                  | Average| Standard Deviation |
|:--------:        |:------:|:--------:          |
|**Hours per task**| 3h 33m  |    3h 24m          |
<br>

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  
||Error rate||
|:-:|:--------:|:-:|
||1.014||

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 4h 10m
  - Nr of automated unit test cases: 49
  - Coverage (overall): 70%
<br>

- E2E testing:
  - Total hours estimated: 7h
  - Total hours spent 9h
- Code review 
  - Total hours estimated: 6h
  - Total hours spent: 9h
- Technical Debt management
  - Total hours estimated: 6h
  - Total hours spent: 2h 30m
  - Hours estimated for remediation by SonarQube: 2h 20m
  - Hours spent on remediation: 1h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  
| Reliability: | Bugs| Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 0   | A      |       0      |

| Security | Vulnerabilities| Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 0   | A      |       0      |

| Maintainability | Code Smells | Debt | Debt Ratio | Rating | Effort to reach A 
|:------------:|:---:|:------:|:-------:|:-------:|:-------:|
|              | 25  | 2h 20m |   0 %   |     A   | 2h 20m |


## ASSESSMENT

- What caused your errors in estimation (if any)? <br>
  The activities for which we have spent more time than estimated are:
  - DB query definition
  - Implementing calendar for Story 6
  - E2E tests and Code review

- What lessons did you learn (both positive and negative) in this sprint?<br>
  We have learned that we should finish the development phase earlier to give more time to testing phase. 

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We have estimated time in a proper way 
  - Less problems with SVC 
  - We have not used more than the hours prescripted
  - Used SonarQube to solve techical debts
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.) 
  - Finish earlier to perform more tests 
  - Find a tool for automate E2E testing

> Propose one or two

- One thing you are proud of as a Team!!
  - We were able to finish all the proposed stories
  - We are enstablishing a good relationship among us