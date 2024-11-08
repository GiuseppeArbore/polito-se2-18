# RETROSPECTIVE (Team 18)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

**Process Measures**

For this sprint, the team selected **3 stories** to complete, with a total of **23 story points** planned and committed to by the end. The initial estimation made during the planning meeting was **80 hours**, while the actual time spent was **79 hours and 25 minutes**, completing the sprint slightly under the planned estimate.
  

**Sum-up**

| Metric           | Planned/Committed | Actual/Completed |
| ---------------- | ----------------- | ---------------- |
| **Stories**      | 3                 | 3                |
| **Story Points** | 23                | 23               |
| **Hours**        | 80 hours          | 79 hours 25 min  |

### Quality Assurance Highlights

- **Unit Tests:** All unit tests are passing, ensuring stable and reliable code at the module level.
- **Code Review:** The code has been rigorously reviewed, ensuring adherence to best practices and improved code quality.
- **Version Control System (VCS):** Code is fully tracked and stored in VCS, ensuring version integrity and traceability.
- **End-to-End Testing:** Comprehensive end-to-end tests have been completed to validate functionality across all components.
### Detailed statistics

| Story                         | # Tasks | Points | Hours est. | Hours actual |
| ----------------------------- | ------- | ------ | ---------- | ------------ |
| _#0_                          | 13      |   -     | 45h  00m   | 41h 10m      |
| KX-1 Add document description | 2       | 5      | 7h 00m     | 8h 45m       |
| KX-2 Link Documents           | 3       | 5      | 7h 30m     | 7h 25m       |
| KX-3 Georeference a document  | 6       | 13     | 20h 30m    | 22h 5m       |

### Key Insights and Areas for Improvement
The team successfully completed all planned stories within scope and maintained a high level of accuracy, completing the project 3.68% under the original time estimate. This alignment indicates strong time management and effective estimation at the story level.

- **Hours per Task:** Estimated at 3.33 hours per task, with actuals close at 3.31 hours, demonstrating effective forecasting overall.
- **Estimation Accuracy:** 
  - **Total Estimation Error Ratio:** -0.73%, indicating minor overestimation at the aggregate level.
  - **Absolute Relative Task Estimation Error:** 10.6%, reflecting some variability at the individual task level. While overall hours aligned closely with estimates, refining task-specific estimates could further enhance predictability.

This project’s high completion accuracy, combined with thorough quality checks, underscores a strong foundation in time management and delivery precision.

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  Here’s a table to summarize the **Detailed Statistics**:

| Metric                                      | Estimated   | Actual      |
| ------------------------------------------- | ----------- | ----------- |
| **Hours per Task**                          | 3.33  hours | 3.31 hours  |
| **Standard Deviation per Task**             | 0.32  hours | 0.48  hours |
| **Total Estimation Error Ratio**            | -           | -0.73%      |
| **Absolute Relative Task Estimation Error** | -           | 10.6%       |



## QUALITY MEASURES

- Unit Testing: 
  - Total hours estimated: 11 hours
  - Total hours spent: 9 hours
  - Nr of automated unit test cases
- E2E testing: 
  - Total hours estimated 11 hours
  - Total hours spent 16 hours
- Code review
  - Total hours estimated 7 hours
  - Total hours spent 9 hours

## ASSESSMENT

- What caused your errors in estimation (if any)?

  > Lack of familiarity with the map library.

- What lessons did you learn (both positive and negative) in this sprint?

  > Utilize technologies like Docker, MapBox (with related libraries), and MongoDB effectively.
  > Leverage each member's unique strengths and capabilities in an organized way to improve outcomes and avoid time wastage.
  > Increase information sharing and communication within the team.

- Which improvement goals set in the previous retrospective were you able to achieve?
  > Propose one or two modification to git workflow. 
   > The one was achieved by The revised Git best practices document which has been updated for greater precision
- Which ones you were not able to achieve? Why?
  > The team was unable to achieve the goal of improving the task division. This was due to the team's lack of familiarity with the technologies used in the project, which made it difficult to accurately estimate the time required for each task.

 

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - [ ] Improve task division.
  - [ ] Prepare demos more thoroughly.
  - [ ] Enhance time management, and reassign tasks if necessary.
  - [ ] Strengthen internal communication.

- One thing you are proud of as a Team!!
  > A supportive spirit, along with a strong commitment to doing the project well, is a fantastic quality in the team. It leads to great results and an enjoyable collaboration.
