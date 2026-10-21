---
kicker: "ROBOTS-5170 · 2025"
chip: "closed beta"
tag: "AI robot setup"
---

# AI robot setup page

A model that determines the meaning of a client’s phrase was being built into the Robots builder. Before, the robot searched a reply for a word from a dictionary. I designed the model’s setup page: knowledge bases, categories, phrases, training, testing and the first introduction to the feature. The case is about the decisions the team made at reviews before the mockups, and which of them reached the release.

MANGO OFFICE · robots and chatbots · 2025 · task `ROBOTS-5170`, epic `ROBOTS-5158`

---

**Role.** Product designer, assignee on task `ROBOTS-5170`: the mockup of the model setup page, user flows in Figma, presenting the solution to the team.

**Team.** The product team prepared the brief and the task description, and the product manager accepted the design. The reviews included the head of product, a product owner, the tech lead, QA, developers and a writer.

**Timeline.** The task was created on 19 June 2025. Five reviews took place on 19 and 20 June. I posted the mockup on 14 July, and the task was closed on 16 July. Sprints 25.3.1 and 25.3.2, design estimate of 5 story points.

**Scale.** Limits from the brief: three knowledge bases, 30 categories per base, 30 phrases per category, 100 characters per phrase.

**Status.** The feature shipped under the name “AI robot”. The closed beta started on 8 September 2025 and took in 60 clients against a target of 100.

**Sources.** Task `ROBOTS-5170` in JIRA, five recordings of the product review from 19–20 June 2025 (about 8 hours), the “Intelligent robots with NLU” page in Confluence, the system demo of 10 October 2025. Remarks from the reviews come from automatic transcripts and are paraphrased.

---

## In brief

**What was there.** The robot branched the dialogue by dictionaries: it searched a client’s reply for a word from a list. When there are many dictionaries, they overlap, and the one higher in the list fires. A language understanding model already worked in a neighboring product, Byvoice. It had to be built into the builder, and all the uncertainty was in the interface.

**What I did.** The model setup page: knowledge bases, categories and phrases, settings, training, a test window and a step-by-step first introduction. At the reviews I proposed importing phrases from a file, because nobody will type hundreds of phrases by hand.

**Key decision.** The setup lives on a separate page in the main menu. A knowledge base is shared by all robots, and the setup is heavy and does not fit into the script’s right panel. In a scenario block, the model is chosen with the same gesture already used to choose a button type in “Chatbot phrase”.

**Result.** The product manager accepted the design on the condition that the feature be marked as beta. The decisions about choosing the model in a block and about branches by category reached the release almost unchanged. The closed beta took in 60 clients against a target of 100.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. The AI robot works inside the voice robot and the chatbot: it determines which category a client’s answer belongs to and leads the dialogue down the right branch.

*Схема продукта*

How the model itself works and which technical arguments stand behind its limits is described in the “AI robot in the robot and chatbot builder” case. This case is about the setup interface.

---

## Problem

The brief describes the problem like this:

> “Dictionaries work on a rather straightforward principle, and if there are many dictionaries, they may overlap a lot, and in case of overlaps, the dictionary that is simply higher in the list will fire.”

The model solves this differently: instead of a list of words, it has categories with example phrases, and it assigns a reply to a category by meaning. The brief had an example that explains the difference well. The robot has a “coffee” category with the phrases “espresso”, “cappuccino”, “latte”, “raf”. A client says “iced latte”; there is no such phrase in the list, but the model understands that the request is about coffee.

The page had to let an administrator:

- create knowledge bases, categories and typical phrases;
- configure the model: the classification method and the confidence threshold;
- train the model and see how well each phrase fits its category;
- check the model in a test window: send a phrase and see which category it matches best and by how many percent;
- go through a step-by-step first introduction to the feature.

The last item was a separate story in the brief: an administrator sees a new feature and does not understand how it works. For most users, the words “intent” and “model training” meant nothing.

The business had specific scenarios. For example, a chain of fitness centers used a robot on the inbound line, and many callers went down the “any question” branch, which fires on a recognition error.

---

## Constraints

| Constraint | How it affected the design |
|---|---|
| The builder is built on a library that its vendor no longer supports | Logic cannot be moved into the connections between blocks, as competitor Twin does |
| A rebuild of the builder interface is planned four quarters ahead | No new entities can be added, and decisions must fit the future navigation |
| Scenario blocks are already overloaded | Any addition makes them worse, so the task came down to making them worse the least |
| A block has no more than 50 branches, and there can be more categories | You cannot branch on the whole base, and the interface needs to explain this |
| Training on the Byvoice platform worked with errors | The training screen must stay useful even if the percentages are inaccurate. The test window provides the check |
| There was no research at the time of the decisions | Decisions were made from references, with a plan to revisit them after research |
| The monetization model is not approved | The “service not connected” state was designed without knowing the price |

---

## Decisions

The team made the decisions below at five reviews on 19 and 20 June. I took part in them as the task’s designer.

### Where the setup lives

The team considered three places: script settings next to the dictionaries, the “Robot phrase” block, and a separate page in the main menu.

**Rejected.** Setup inside the script. The dictionaries already live there, and the person does not leave the builder.

**Chosen.** A separate page. A knowledge base is shared by all robots and is not owned by a script. The setup is heavy: training, testing, import. A separate menu item also shows that a new feature has appeared.

There is little room in the top panel, so the menu was made two-level. For now it has one item, and it is groundwork for the dictionaries to move into the same section later, so the navigation does not have to be redone twice. Inside the builder, a simplified view of categories without editing or training was kept, so that you do not have to leave the page for a list of categories while building a script. Dictionaries already work the same way.

### How to call the model in a block

This was the longest discussion of the reviews. The options considered:

- **A separate block on the canvas.** The product owner defended it: the block appears only after purchase, which is convenient for monetization, and the overloaded block is left alone. Rejected: multiplying blocks before the builder is rebuilt is not allowed.
- **Logic in the connections, as at Twin.** At Twin, a connection between blocks carries the intent and a confidence threshold, and there are few blocks. The most elegant solution, but the builder engine does not support it. Moving only one block to connections would break consistency.
- **Tabs in the block.** Rejected: switching between tabs is slow, and many people in the product do not read green tabs as a switch.
- **A toggle in the block.** Rejected by a design system rule: toggles and checkboxes must not change the whole interface.
- **A second mode in the AI assistant block.** A person looks for the familiar word “AI” and chooses GPT or the model. Rejected: too many dividers inside one block.

**Chosen.** On pressing “Add answer”, the person chooses the source: a dictionary or the model. Then they configure the chosen source. This gesture already exists in the “Chatbot phrase” block: there, when adding a button, you choose its type, and the settings adapt to the choice. No new element had to be introduced.

### Structure and training

- A two-level list: knowledge bases, categories inside them, phrases inside categories.
- Each base has its own training status. Training takes up to several minutes, so the status updates without reloading the page. The same mechanism covers the case when the base is edited in a neighboring tab or by another user.
- A phrase that fits its category poorly is highlighted in color but is not deleted automatically. The user is entitled to keep it.
- The test window answers the question “does it even work” before the robot is launched.
- An untrained base cannot be used without a warning.

### Importing phrases

At first, phrases were entered by hand, one at a time. In the discussion of limits, it came up that a category might need up to 500 phrases, and there could be up to 100 categories. I brought an argument from previous work, where I had made a clustering interface: people who do this professionally keep phrases in Excel, and nobody will type them in by hand.

Import and export were added to the feature’s scope and split into two scenarios:

| What | Format | For whom |
|---|---|---|
| Phrases of one category | CSV, one phrase per line | the client works with their own data |
| A whole knowledge base | a closed format | moving between the company’s products |

Search and selective export of phrases were rejected: if a person needs the phrases, they need all of them, so there is one button per category. It was decided to show import errors up to the first one and not to perform a partial upload. With tens of thousands of rows, the error list would become unreadable, there is nowhere in the product to fix the errors anyway, and a partial upload is worse than a full refusal: it is unclear what got uploaded.

Later, the limit in the design brief was cut to 30 phrases per category, and import stopped being urgent. It did not make it into the acceptance criteria of `ROBOTS-5170`.

### Branching

- One knowledge base per block.
- One category gives one branch. Choosing several categories per branch was postponed: it breaks the rule “a branch equals an action”.
- A separate branch for when a phrase landed in the base but not in the selected categories. The product already has this technique: “other options” in the schedule.
- There can be more categories than a block has branches. You cannot branch on the whole base, and the interface has to explain this with a message.

The team left one question until the mockups. If the base is chosen when adding each answer, it is unclear which base is already selected in the block. Both proposed options were judged unsuccessful, and the simplest one was recorded with a note to revisit it after design.

### A paid feature

- The menu item is always visible, even without the service, otherwise nobody will learn about the feature.
- Without the service connected, a placeholder opens with a link to the service page.
- Without the contact center, a “Contact your personal manager” dialog opens.
- The offer to buy is in one place, the main menu. At the review it was agreed directly not to bring the product to a state where half the interface is covered with locks.

### First introduction

According to the brief, it is a five-step interface: create a knowledge base and understand what it is; create categories and phrases and understand how they relate; configure and train the base; test it; sum up and suggest applying it in practice. The novelty in the builder is announced by a welcome screen and a design system hint attached to the new element.

### Metrics

At the review we agreed which events to collect:

| Event | What it shows |
|---|---|
| Creating a knowledge base and a category | whether people get as far as creating, and how many categories a base has |
| Pressing “Train” | whether people understand that the base needs training |
| Connecting and disconnecting the service, as separate events | the real number of active connections |
| Clicking the menu item without the service connected | whether the feature interests those who have not bought it |
| Choosing a base and a category in a block | whether people get from setup to use |
| Uploading phrases from a file | whether import paid off |

---

## How the work went

At the first review, the team agreed to bring two or three worked-out options built around real client scenarios to approval, to start with an early draft together with the approving side, to make research the feature’s first task, and to split the feature into separate stories. About a month was set aside for design, assuming quick approvals.

QA insisted that without design and research the feature could not be estimated and taken into the quarter. The head of product replied that he needed a good solution first, and a short one after that. The feature did not fit into the quarter, and this was said openly.

Less than a month passed from creating the task to the mockup: the task was created on 19 June, and I posted the mockup on 14 July.

---

## Result

**Acceptance.** On 14 July 2025 the product manager accepted the design with a condition:

> “I accept the design on the condition that a ‘Beta’ badge or a note is added saying that this functionality is available in beta mode and may not work correctly. This is important for us and for users.”

**Release.** At the system demo on 10 October 2025 the feature was already called “AI robot”, and the abbreviation NLU remained internal. The decisions from the reviews reached the release almost unchanged:

- the “dictionary or model” choice is made in the “Chatbot phrase” block, on the “Answer processing” tab;
- first you choose an AI robot, then its categories or all of them at once;
- if the selected category is found, the dialogue follows its branch; if another category of the AI robot is found, it follows the common branch;
- for the chatbot, more than a test window was made: a separate test page with a chat.

**Closed beta.** According to the product manager’s plan, the beta ran from 8 September (3 September was planned at first) to early December 2025, and the feature is tentatively to open to all clients in February 2026. Clients were invited with banners in two personal accounts, and only those with the contact center and robots connected. The beta took in 60 clients against a target of 100. Participants include Ozon Bank, the Renaissance clinic, a chain of fitness centers and a recruiting agency.

---

## Not in the archive

- `[ADD: mockup screens: the list of bases, a category with phrases, training, the test window, the first introduction]`
- `[ADD: how the question of which base is already selected in a block was resolved]`
- `[ADD: whether the research set as the first task was carried out]`
- `[ADD: what the beta showed besides the number of participants, and figures for the events from the metrics table]`
- `[CHECK: whether the “Beta” badge appeared in the interface]`

---

## Takeaways

**An example explains the difference between a dictionary and a model best.** “Iced latte”, which is not in the list but which the model assigns to “coffee”, is clearer than any definition.

**A new element is cheaper to introduce through a familiar gesture.** Choosing the source of an answer repeats choosing a button type, and the user did not have to learn anything new.

**The amount of data defines the scope of a feature.** While it was about 500 phrases per category, the feature would have been unusable without import. When the limit was cut to 30, import was postponed.

**A paid feature is worth showing in one place.** The menu item is visible to everyone, and there are no locks on the blocks.

**Now I would push for research before the decisions.** At the reviews everything was decided from references, and some questions had to be left until the mockups.

---

## Sources

```
01 РОБОТЫ И AI-АССИСТЕНТ/Confluence и JIRA/[ROBOTS-5170] [Дизайн] Реализовать меню настройки модели NLU   brief, criteria, acceptance
01 РОБОТЫ И AI-АССИСТЕНТ/Confluence и JIRA/Интеллектуальные роботы с NLU                   beta plan and first participants, revision of 26.11.2025
01 РОБОТЫ И AI-АССИСТЕНТ/Видео и расшифровки/NLU (ROBOTS-5158, 5170)/                      five review recordings, 19–20.06.2025
01 РОБОТЫ И AI-АССИСТЕНТ/Видео и расшифровки/Демо осень 2025 (бета NLU)/                  system demo 10.10.2025
01 РОБОТЫ И AI-АССИСТЕНТ/Figma/ROBOTS-5170, 5454 _ Меню настройки модели NLU.fig          mockup
```

File paths in the archive are given in the original Russian. Quotes are translated from Russian.
