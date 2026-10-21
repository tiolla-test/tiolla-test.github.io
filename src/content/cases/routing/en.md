---
kicker: "Voice robots · 2024–2025"
chip: "shipped"
tag: "routing"
---

# Routing by business context

An improvement to background events in voice robots. Before, a robot could intercept a conversation with a key phrase only once, and after the interception the conversation went to its end. Now you can return from a background branch to the main scenario, and starting a branch can be limited by conditions, such as the client’s category from the CRM. I made the mockups: the conditions for starting a branch, the comparison inside a condition, and how to show the move into a background branch in the statistics.

MANGO OFFICE · voice robots · 2024–2025

---

**Role.** Product designer, mockups for the feature.

**Team.** The Robots product team. A developer checked how conditions work on the Byvoice platform. The product team showed the finished feature at a system demo.

**Timeline.** The review where the mockups were discussed took place on 4 October 2024. The recording of the system demo where the feature is shown finished is dated 31 January 2025 in the archive.

**Scale.** An improvement for clients with large scripts. At the demo, Ozon Bank was given as an example: it has very large scripts and often runs into the limits.

**Status.** Shipped and shown at the system demo. The recordings do not show how the move into a branch ended up looking in the statistics.

**Sources.** A transcript of the product review of 4 October 2024 and a transcript of the system demo. Remarks are paraphrased from automatic transcripts.

---

## In brief

**What was there.** A background scenario intercepted the conversation if the client said a phrase from a dictionary, for example “transfer me to an operator”. It could intercept only once; after that the conversation went toward its end, and there was no way back to the main scenario. Sometimes the interception fired where it was not needed.

**What I did.** Mockups of the conditions for starting a background branch and of the comparison inside a condition. I proposed options for showing the move from the main scenario to the background one in the statistics.

**Key question.** How to distinguish the move into a background branch in the statistics if the dashed line is already taken: in the statistics, a dashed line marks entering a procedure.

**Result.** The feature shipped. From a background branch you can return to where the main scenario was interrupted. A “visit only once” checkbox and branch start conditions appeared. The recordings do not say which way of showing it in the statistics was chosen.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. Besides the main scenario, a voice robot has a background one: an independent branch that fires if the client interrupts the robot with a key phrase. All blocks and variables are available in the background scenario.

*Схема продукта*

---

## Problem

At the system demo, the limitations of the old background events were listed as follows:

- a conversation could be intercepted once per conversation;
- after the interception, the conversation inevitably went toward its end;
- it was impossible to return to the place where the main scenario was interrupted;
- it was impossible to intercept the conversation again and go down a different branch;
- the interception could fire where, under certain conditions, it should be skipped.

For clients with large scripts, this meant building the scenario around the limitations. The goal of the improvement was named at the demo: to make script setup many times more flexible.

The second part of the task gave the feature its name. Starting a background branch should depend on the business context of the call. An example from the demo: the robot queries the CRM, learns from the number that a VIP client is calling, and gives them more branches for interception than a regular client.

---

## Decisions

### Branch start conditions

In the mockups, one background event can have several conditions, and the branch starts only if all of them are met. At the review the example was a client from Moscow, of a certain age and with VIP status at the same time.

The team checked separately how conditions are combined on the Byvoice platform: a developer confirmed that conditions work on an “AND” basis. The logic of the mockup matched the logic of the platform.

### Comparison in a condition

A condition has three fields, the first being a variable. For the second field we agreed to do the same as in the “Compare values” block: the person chooses a variable or a value, and the value is written as one word, without listing values separated by commas.

### The move into a background branch in the statistics

Robot statistics show the dialogue record as continuous text in the order the script was passed. It already had a technique for a similar task: entering a procedure is marked with a dashed line. The move from the main scenario to the background one needed to be marked the same way, but distinguished from a procedure.

At the review I proposed three directions:

- a different dashed line, dotted or wavy;
- highlighting the background branch with color;
- a third option that did not exist yet at the time.

At the review I said that it was hard to choose between the dashed line and the highlight and that I needed a few days. The front-end developers replied that a dotted line was easy to do. A colleague clarified that all rows of the background branch could be filled with color. The team asked to see both options, the dotted line and the color highlight. A collapsible list for the background branch was also discussed, but it was decided it was not needed: movement through the script in the record is sequential.

We agreed to revisit the front-end estimate after the mockups were refined.

---

## Result

At the system demo the feature was shown finished.

- You can enter a background branch, go through it to the end and return to where the main scenario was interrupted.
- Instead of returning, the background branch can be connected to the main scenario right in the builder.
- A “visit only once” checkbox protects against the other party deliberately looping the conversation.
- Conditions limit when a branch starts, for example by the client’s status from the CRM.
- Interception also works from inside a procedure. At the demo, whether clients need this was called a hypothesis still to be tested.

The demo also showed the run statistics, but the transcript does not describe how the move into a background branch is marked in them.

---

## Not in the archive

- `[ADD: which way of showing the move in the statistics was chosen and why]`
- `[ADD: mockup screens: start conditions, comparison, statistics]`
- `[ADD: the recording of the first review, referred to as “last time”]`
- `[ADD: whether clients use conditions and the return from a background branch]`

---

## Takeaways

**A visual device that already means something cannot be reused for another meaning.** In the statistics, the dashed line meant entering a procedure, so the background branch needed its own sign.

**The logic of a mockup is worth checking against the platform.** “AND” conditions in the mockup matched how the Byvoice platform works, and this was checked before development.

**A new field is better built on the pattern of an existing block.** The comparison in a condition repeats the “Compare values” block, and the user does not need to learn anything new.

---

## Sources

```
01 РОБОТЫ И AI-АССИСТЕНТ/Видео и расшифровки/AI-ассистент и GPT/ПБР РОБОТЫ яндекс gpt                 review of 04.10.2024, start of the recording
01 РОБОТЫ И AI-АССИСТЕНТ/Видео и расшифровки/AI-ассистент и GPT/СИСТЕМ ДЕМО РОБОТЫ АИ АССИСТЕНТ       system demo, start of the recording
_КЕЙС ПОРТФОЛИО (роботы и чат-боты)/15 ПРОДУКТ — всё о роботах и чат-ботах.md                     the background scenario in the robot’s structure
```

File paths in the archive are given in the original Russian.
