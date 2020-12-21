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
|**Stories**     |     5     |    5       | 
|**Story Points**|     28    |    28      | 
|**Hours**       |     72h   |    69h     | 

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
| _Issues management_  | 3        |    -     |   7h 30m    | 3h      |
| _#0_      | 2        |    -     |   13h    | 9h       |
| _#12_     | 2        |    8     |   3h 30m | 9h       |
| _#13_     | 2        |    5     |   4h     | 2h 30m   |
| _#14_     | 1        |    8     |   1h     | 2h       |
| _#15_     | 1        |    2     |   2h     | 30m      |
| _#16_     | 2        |    5     |   5h     | 5h       |
| _Testing_ | 7        |    -     |   34h    | 41h      |
| _Docker Configuration_ | 1      |    -     |   2 h    | 2h   |

   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

|                  | Average| Standard Deviation |
|:--------:        |:------:|:--------:          |
|**Hours per task**| 3h 26m  |    3h 22m          |
<br>

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  
||Error rate||
|:-:|:--------:|:-:|
||1.00||

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 6h
  - Nr of automated unit test cases: 65
  - Coverage (overall): 47%
<br>

- E2E testing:
  - Total hours estimated: 7h
  - Total hours spent 9h
- Code review 
  - Total hours estimated: 14h
  - Total hours spent: 17h 30m
- Technical Debt management
  - Total hours estimated: 6h
  - Total hours spent: 1h 30m
  - Hours estimated for remediation by SonarQube: 5h
  - Hours spent on remediation: 30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  
| Reliability: | Bugs| Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 4   | C      |       16min      |

| Security | Vulnerabilities| Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 0   | A      |       0      |

| Maintainability | Code Smells | Debt | Debt Ratio | Rating | Effort to reach A 
|:------------:|:---:|:------:|:-------:|:-------:|:-------:|
|              | 59  | 5h 12m |   0.1%   |     A   | 0|


## ASSESSMENT

- What caused your errors in estimation (if any)? <br>
  The activities for which we have spent more time than estimated are:
  - Implementing story about CSV loading 
  - Learning and doing E2E automated tests
- What lessons did you learn (both positive and negative) in this sprint?<br>
  We have learned that we should help each other more and that we should be more clear to say if we don't know how to do something. 

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We have finished development earlier
  - We have learned how to do automated E2E tests  
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.) 
  - Having more unit tests coverage and do E2E tests for all the stories done so far

> Propose one or two

- One thing you are proud of as a Team!!
  - We were able to finish all the proposed stories
  - We have started doing E2E automated tests
  - We have unnderstood that helping each other will lead to less work and a better software product