---
kicker: "ROBOTS-32 · 2023"
chip: "released"
tag: "procedures"
---

# Procedures in the script builder

A procedure collapses part of a scenario into a single block on the canvas. It was needed to raise the script limit from 100 to 300 blocks without making large scripts unmanageable. The team tested the choice between two procedure models on clients whose scripts had more than a hundred blocks.

MANGO OFFICE · voice robots · 2023 · task `ROBOTS-32`

---

**Role.** Project designer on task `ROBOTS-32`. `[ADD: what I did myself: prototypes, test scenarios, final mockups]`

**Team.** Feature brief dated 9 February 2023. The `MNUX-194` study was run by a UX researcher.

**Timeline.** Brief on 9 February 2023, research from 1 to 14 February, front-end development from 15 February.

**Scale.** Clients in healthcare and housing services needed 100 to 150 blocks per script. The test participant with the largest scenario had 823 blocks across several scripts.

**Status.** The feature is released: the builder has an “Enter procedure” block and a “Procedures” button. The test results cannot be reconstructed from the archive.

**Sources.** Feature brief, the `MNUX-194` research brief, the usability test report, 13 screenshots of the released interface.

---

## In brief

**What was there.** A script could have no more than a hundred blocks. Large clients in healthcare and housing services did not have enough, and clients with large scripts were leaving.

**What we did.** Procedures: part of a scenario collapses into one block. The team designed two procedure models, built three prototypes for each and tested them on clients with the largest scripts. A block counter appeared in the builder header.

**Key decision.** The procedure model was chosen in a usability test with clients whose scripts had more than a hundred blocks. The two models behave differently when edited, and the team tested both before development started.

**Result.** The release has an “Enter procedure” block, a “Procedures” button and a block counter. The block’s name suggests that the second model was chosen. The archive has no document with the decision and no test results.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. Procedures appeared in the voice robot builder. The brief says directly that chatbots will hit the same ceiling once they are added to the platform.

*Схема продукта*
---

## Problem

The limit of a hundred blocks per script got in the way of large clients. Their scenarios needed 100 to 150 blocks. The brief lists four sources from which the team knew about the problem:

- analysis of the scripts of clients who already have 50 blocks or more;
- complaints that such scripts are confusing;
- churn of clients with scripts over a hundred blocks;
- connection requests reviewed by the implementation team.

The brief has two goals: raise the limit to 300 blocks and fully eliminate churn caused by the limit.

---

## Constraints

The limit could not be raised with a single setting. The team wrote this down in the brief before the work began:

> “We understand that simply increasing the limit will lead to other problems: longer script opening times; complexity and confusion in developing and maintaining such complex scenarios.”

Three hundred blocks instead of a hundred are switched on in the backend. Only the interface can make three hundred blocks easier to handle than the old hundred. The load was real too: the non-functional requirements included measuring speed at 100, 200 and 300 blocks.

Among competitors, a similar mechanism was found only at Robo-voice, which has nested scenarios. Voximplant and Aimylogic did not have it.

---

## Decisions

### Two procedure models

The mechanics are simple: part of a scenario collapses into a procedure, and one block of it remains on the canvas. The hard question was how a procedure relates to a block. The team designed two options.

| | Option 1 | Option 2 |
|---|---|---|
| Model | One procedure per block | One procedure for several blocks |
| Creation | Clicking a block creates a procedure | A procedure is created separately, then attached to a block |
| Reuse | By copying the block | One procedure is assigned to different blocks |
| Editing | Editing a block changes its procedure | Editing a procedure changes it in all attached blocks |

In the first option, the procedure belongs to the block, and an edit affects only that block. In the second, the procedure exists on its own, and an edit spreads to every place where it was called. The second option is more powerful but riskier: a person fixes one block and changes five others along the way.

The team took the choice between the models to a usability test. For each model, three Figma prototypes were built: creation with copying, behavior at the limit of ten procedures, and deletion.

### Usability test

Participants were selected by script size: the brief has the criterion “maximum number of blocks, from a hundred”.

| Client | Blocks in the script |
|---|---|
| BIS-Novosibirsk | 823 |
| Svyazservis | 274 |
| AtomZhKKh | 236 |
| Akvalain | 147 |
| Agroeko-Yug | 124 |

823 blocks do not fit into one script with a limit of a hundred. So the client spread the scenario across several scripts, and that is why it is so hard to maintain.

The report says “6 respondents”, while the table lists five companies. Perhaps two people were from the same company. The discrepancy is in the document itself.

Each participant went through four scenarios in both options: creation, copying, behavior at the limit, deletion. At the end they rated the statement “it was easy for me to create a procedure” on a five-point scale.

### Hypotheses

The brief has thirteen hypotheses and one scaled question. The hypotheses describe where a person might make a mistake. For example:

> “Users believe that when editing, the procedure will change only in one block, not in all attached ones.”

> “The user may not understand that a procedure and a block have been created, may accidentally create many blocks with procedures, and this will overload the database.”

> “The user tries to create more than 10 blocks because they do not understand or notice that there is a limit and the button in the left menu gets blocked.”

The hypotheses fall into two groups. The first is about understanding the model: a person is used to editing a block locally and does not expect the procedure to change everywhere. This is the risk of the second option. The second group is about consequences: accidentally created procedures overload the database, and the limit shows up as a blocked button without explanation.

### Block counter

A block counter appeared in the builder header, for example 42/100. Before, a person learned about the limit when they hit it. The counter shows the remaining room in advance.

---

## Result

Screenshots of the client script “Med.Klinika” show four changes in the release:

- the block palette got “Enter procedure”;
- the top panel has a “Procedures” button;
- next to it is the block counter, showing 42/100 in the screenshot;
- the neighboring item is “Go to script” with a NEW label, meaning scripts can now be linked to each other too.

Judging by the block’s name, a procedure became a separate entity that the block leads into. That is the second model. This conclusion is drawn from indirect evidence; the archive has no document with the decision. The counter in the screenshot shows a limit of 100, and the archive does not show whether it was raised to 300.

The test took place before development started, but with no margin: development started the day after the research ended.

Procedures closed a finding from the `MNUX-292` builder study: “a scenario cannot be reused in another”. At the same time, the limit of ten procedures was implemented as a blocked button without explanation. The same `MNUX-292` lists this behavior among the reasons for support requests.

---

## Not in the archive

- `[ADD: usability test results and why the model was chosen]`
- `[ADD: mockups of both options from the Figma prototypes]`
- `[ADD: whether the limit was raised to 300 and whether churn changed]`
- `[LISTEN: «ПРОЦЕДУРЫ пбр» 57 min and «Процедуры Дима» 28 min, not transcribed]`

---

## Takeaways

**A limit is better shown as a number in advance.** A 42/100 counter in the header warns earlier than an error message.

**Reuse changes the data model.** When one procedure can be attached to several blocks, an edit stops being local. Half of the test hypotheses grew out of this.

**A button blocked without explanation leads to support requests.** A neighboring study of the same product says so in plain text.

**A model is better tested on those who have already hit the limit.** A client with an 823-block scenario knows more about the problem than any document.

---

## Sources

```
Confluence и JIRA/[MNUX-194] Роботы. Исследование процедуры.pdf   brief, 13 hypotheses and a scaled question
UX-исследования/usability-тест Роботы. Процедуры.pdf               9 pages, 6 respondents
Документы/Создание сложных скриптов с помощью процедур.pdf         feature brief
Confluence и JIRA/Создание сложных и больших скриптов с помощью процедур.pdf
Скрины/Процедуры (серия 2)/                                        13 screens and a legend
Видео и расшифровки/Конструктор и процедуры/ПРОЦЕДУРЫ пбр          57 min
Видео и расшифровки/Конструктор и процедуры/Процедуры Дима         28 min
```

File paths in the archive are given in the original Russian. Quotes are translated from Russian.
