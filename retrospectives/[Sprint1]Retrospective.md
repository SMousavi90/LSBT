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
|:--------:      |:---------:|:--------:  |
|**Stories**     |     5     |    5       | 
|**Story Points**|     11    |    11      | 
|**Hours**       |     72h   |    85h 20m | 

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
| _#0_      | 5        |    -     |   35h    | 37h 40m  |
| _#1_      | 2        |    2     |   8h     | 8h 30m   |
| _#2_      | 2        |    2     |   5h     | 6h 40m   |
| _#3_      | 2        |    2     |   4h 30m | 5h 30m   |
| _#4_      | 1        |    2     |   1h 30m | 1h 30m   |
| _#5_      | 2        |    3     |   2h     | 1h 45m   |
| _Testing_ | 3        |    -     |   16h    | 22h 15m  |

   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

|                  | Average| Standard Deviation |
|:--------:        |:------:|:--------:          |
|**Hours per task**| 5h 1m  |    4h 32m          |
<br>

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  
||Error rate||
|:-:|:--------:|:-:|
||0.84||

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3h
  - Total hours spent: 5h
  - Nr of automated unit test cases: 16
  - Coverage (overall): 71%
<br>

- E2E testing:
  - Total hours estimated: 6h
  - Total hours spent 7h 30m
- Code review 
  - Total hours estimated: 6h
  - Total hours spent: 7h 30m
- Technical Debt management
  - Total hours estimated: -
  - Total hours spent: -
  - Hours estimated for remediation by SonarQube: 1h 38m
  - Hours spent on remediation: -
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
|              | 23  | 1h 38m |   0 %   |     A   | 1h 38m  |


## ASSESSMENT

- What caused your errors in estimation (if any)? <br>
  The activities for which we have spent more time than estimated are:
  - Planning poker
  - Backend implementation
  - Testing

- What lessons did you learn (both positive and negative) in this sprint?<br>
  Some tasks seem simple but can require moree time than the expected. Then we have also learned that low story points doesn't mean less time needed. 

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We were able to let each other know what we were doing
  - We have used in a better way Jira time log functionalities
  
- Which ones you were not able to achieve? Why?
  - Nonee 

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - More scrum meetings 
  - Better time estimation
  - More coordination when using SVC (git)
  - Try to not use more than the "allowed" 72 hours
  - Use in a better way SonarQube information

> Propose one or two

- One thing you are proud of as a Team!!
  - We were able to finish all the proposed stories
  - We have known better each other abilities and character  