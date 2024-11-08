# TEMPLATE FOR RETROSPECTIVE (Team ##)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

**Process Measures**

- For this sprint, we selected 3 stories to complete, with a total of 16 points planned and committed to by the end. The team initially estimated 80 hours in the planning meeting, but the actual time spent was 79 hours and 25 minutes, slightly under the planned estimate.

**Sum-up**

| Metric           | Planned/Committed | Actual/Completed |
| ---------------- | ----------------- | ---------------- |
| **Stories**      | 3                 | 3                |
| **Story Points** | 16                | 16               |
| **Hours**        | 80 hours          | 79 hours 25 min  |

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story                         | # Tasks | Points | Hours est.                | Hours actual            |
| ----------------------------- | ------- | ------ | ------------------------- | ----------------------- |
| _#0_                          | 13      |        |                           |                         |
| KX-1 Add document description | 2       | 5      | 7 hours                   | 1 day 45 minutes        |
| KX-2 Link Documents           | 3       | 5      | 7 hours 30 minutes        | 7 hours 25 minutes      |
| KX-3 Georeference a document  | 6       | 13     | 2 days 4 hours 30 minutes | 2 days 6 hours 5minutes |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  Here’s a table to summarize the **Detailed Statistics**:

| Metric                                      | Estimated | Actual |
| ------------------------------------------- | --------- | ------ |
| **Hours per Task**                          |           |        |
| **Standard Deviation per Task**             |           |        |
| **Total Estimation Error Ratio**            |           |        |
| **Absolute Relative Task Estimation Error** |           |        |

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated
  - Total hours spent: 30 minutes
  - Nr of automated unit test cases
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review
  - Total hours estimated
  - Total hours spent : 9 hours 5 minutes

## ASSESSMENT

- What caused your errors in estimation (if any)?

  > Lack of familiarity with a library like MapBox.

- What lessons did you learn (both positive and negative) in this sprint?

  > Utilize technologies like Docker, MapBox (with related libraries), and MongoDB effectively.
  > Leverage each member's unique strengths and capabilities in an organized way to improve outcomes and avoid time wastage.
  > Increase information sharing and communication within the team.

- Which improvement goals set in the previous retrospective were you able to achieve?
  > Propose one or two better coordinate git workflow
- Which ones you were not able to achieve? Why?

  > The one was achieved by The revised Git best practices document which has been updated for greater precision

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Improve task division.
  > Prepare demos more thoroughly.
  > Enhance time management, and reassign tasks if necessary.
  > Strengthen internal communication.

- One thing you are proud of as a Team!!
  > A supportive spirit, along with a strong commitment to doing the project well, is a fantastic quality in the team. It leads to great results and an enjoyable collaboration.
