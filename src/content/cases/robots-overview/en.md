---
kicker: "Robots · 2023–2025"
chip: "live product"
tag: "builder overview"
---

# Voice robot and chatbot builder

An overview case about my work as a product designer on the MANGO OFFICE Robots team from 2023 to 2025. The product is sold as no-code: any administrator can build a robot. Research showed that people without technical experience do not get to a working robot, and found three reasons why. The case is about which hypotheses I tested, which were confirmed and which were not.

MANGO OFFICE · robots and chatbots · 2023–2025 · overview case

---

**Role.** Product designer on the Robots team. Project designer for procedures (`ROBOTS-32`) and for the builder research (`MNUX-292`), author of the AI robot setup page (`ROBOTS-5170`), the new interface of the “Robot phrase” block and the mockups for routing by business context. Requester of the `MNUX-285` and `MNUX-303` studies, author of four competitive reviews.

**Team.** Product managers, UX researchers, development, the support department, the implementation team.

**Timeline.** From 2023 to 2025. The 2022 study the case starts with was run by a UX researcher.

**Scale.** The research briefs describe the service as live, with 500+ clients. The voice robot costs 5,000 ₽ a month and includes 1,600 minutes of conversation; the chatbot with the builder costs 3,500 ₽ a month.

**Status.** A live product. The archive has no metrics that would show the effect of the improvements after release.

**Sources.** Research reports `MNUX-172`, `MNUX-197`, `MNUX-285`, `MNUX-292`, `MNUX-303` in Confluence, four competitive reviews, a meeting on product metrics, the Robots product reference. Quotes from the reports are verbatim in Russian and translated here.

---

## In brief

**What was there.** Robots is sold as a builder that anyone can figure out. A 2022 study showed otherwise. Robots are set up by system administrators and programmers, or by MANGO OFFICE staff for an extra fee. Of the two respondents without technical experience who tried on their own, neither succeeded.

**What I did.** As the project designer, I took part in the largest builder study, `MNUX-292`. I made a new interface for the “Robot phrase” block. I requested studies to test my hypotheses about script types, templates and this interface. I made four competitive reviews and designed the AI robot setup page.

**Key finding.** Complaints of the “inconvenient” kind broke down into three different problems: work gets lost, the platform silently forbids actions, and the canvas stops working at a hundred blocks.

**Result.** The hypothesis about script types was confirmed: 4 of 6 respondents believed that with the wrong type the robot would not work. The hypothesis about tutorials inside templates was not confirmed. My new “Robot phrase” interface lost to the old one in a survey of 101 people: 22 % against more than 40 %. The archive does not say how the product metrics changed after the improvements.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot for calls, the chatbot for text channels, the robot administrator for call campaigns, and the AI robot and AI assistant inside scenarios. Scripts for all of them are built in a visual builder: the user lays out blocks on a canvas and connects them. On the platform, a robot counts as an employee: it has a profile card, an internal number, and a place in groups and reports. The product runs on top of the virtual PBX and the contact center.

*Схема продукта*

Details of individual tasks are described in the neighboring cases: procedures, routing, webhooks, AI assistant, AI robot, AI robot setup and analytics.

---

## Problem

### Product goals

At a meeting on product metrics, the team named two key metrics: the number of clients and traffic. Return on investment and EBITDA were removed from the set: the product is young, and at this stage investment exceeds revenue. DAU and MAU were removed too. A robot is set up once and then left alone, and a daily visits metric would show a problem where there is none.

Churn was named as a separate pain point. About 20 clients left in September and about 17 in October, while about 40 came in September. The business asked for a depth-of-use metric: how many scenarios are set up, how many runs succeed, how fast a client launches their first script. Time to first value could not be measured, because the data has no moment of the client’s first contact with the product.

At the same meeting, design got a separate task: after every release, check whether people use the new interface elements.

### What the 2022 study showed

In October 2022 a UX researcher ran interviews with usability testing on seven clients (`MNUX-172`). Robots were set up in two ways: by the clients’ own technical specialists or through MANGO OFFICE’s paid setup service. The technical specialists saw no problems:

> “Even a housewife could figure it out.” (client, Samotlor Trakt)

Two people without technical experience tried on their own, and neither got to the end. One found the instructions too heavy and went straight to MANGO OFFICE. The other got tired of switching tabs and rereading the instructions and said that if he had known how long it takes, he would have ordered the service right away.

The same study found that people rarely go into scripts: a few times during setup and when making changes. Six clients out of seven did not use the “Robot action” column in the statistics and did not know it existed.

The problem was visible neither in support nor in reviews. Those who managed were satisfied. Those who did not went to the paid service and did not complain.

---

## Users

The builder has three audiences, and almost every decision has to be tested on all of them.

**An administrator without technical experience.** The main audience according to the product’s positioning. The answer reference, hints and ready-made templates are for them.

**An integrator or developer.** Appears where http requests, webhooks and regular expressions are needed.

**A script writer and the MANGO OFFICE implementation team.** They build scenarios for clients for an extra fee. According to the implementation team, clients order paid setup more often than they edit scripts themselves.

---

## Constraints

Almost every interface decision in the product runs into a technical limit:

| Constraint | Value | What grew out of it |
|---|---|---|
| Blocks per script | 100 | procedures |
| Robot variables | 50, text only, live for one dialogue | the debates in the webhooks and routing cases |
| Scripts per robot | one at a time | the robot card holds the script assignment |
| Traffic per robot | 1,600 minutes a month | the pricing ladder |
| Robot administrators | three at 10,000 ₽ | a webhook cannot be attached to a robot |
| AI robot model size | about 2 GB | a limit on the number of knowledge bases |

---

## Research

All studies were run by the team’s UX researchers.

| Study | When | Method and sample | My role |
|---|---|---|---|
| Robots. General study, `MNUX-172` | October 2022 | interviews and usability test, 7 clients | not stated |
| Robot phrase, `MNUX-197` | May 2023 | moderated usability test, 5 participants | not stated |
| UI inside the script, `MNUX-292` | December 2024 to March 2025 | contextual interviews, 8 respondents | project designer |
| Choosing a script type and templates, `MNUX-285` | December 2024 to January 2025 | 6 respondents | one of the requesters |
| New UI of the “Robot phrase” block, `MNUX-303` | February 2025 | survey in Yandex Vzglyad, 101 people | interface author and test requester |

---

## Key finding

The largest study, `MNUX-292`, was run by a UX researcher at the request of the product manager, and I was its project designer. Eight contextual interviews: four support department managers who build robots for clients every day, and four client companies. The study looked at working with connections when there are many blocks on the canvas. The report came to 32 pages, and its findings are summarized in tables with a user story, a segment and an impact score from 1 to 5.

Complaints that used to sit in one “inconvenient” pile broke down into three different problems.

**Work gets lost.** The block has no autosave, no undo and no version history. Autosave and versions got an impact score of 5 for small businesses and large companies.

> “when you’re working with the menu there’s no autosave, sometimes you hit Escape by accident and everything goes to hell! (a 5)”

> “if you mess up somewhere, you scrap all your work to delete what you don’t need, because later you’ll never find it. When it’s an http block, that can be very painful”

**The platform silently forbids.** A background scenario cannot be connected to a regular block, and two scenarios cannot be connected to each other. There is no error, and users think they have run into a bug. There are 50 variables, and only 10 can be used in emails. A scenario cannot be reused in another one, variables cannot be passed between robots, and a script cannot be moved to another account.

**The canvas stops working at a hundred blocks.** Connections coming into one block merge into one line. The button to delete a connection is small and appears only in the middle of the connection. There is no group selection. People navigate blocks by color and ask for brighter colors.

I linked the first problem with a fact from the 2022 study: people rarely go into scripts. Perhaps it is not only that a robot is set up once. If any edit risks losing an hour of work with no way to roll back, it is better not to touch a working script. This is my hypothesis; nobody has tested it.

---

## Decisions

### Script types

When creating a script, you have to choose a type: incoming call, outgoing campaign, internal call. While reviewing competitors’ templates in December 2024, I noticed that the script is created the same regardless of type. The type works only as a label in the scripts table: you can create an “incoming” script and assign the robot to an outgoing campaign.

I assumed that the choice at the first step confuses people and proposed creating a script without a type, filling in the type from where the robot is assigned. I took this hypothesis into the `MNUX-285` study, where I was one of the requesters. The researcher interviewed six people: three support managers with little experience in Robots and three implementation staff who know the product well.

The hypothesis was confirmed. Four of the six decided that with the wrong type the robot would not work. Two knew it works with any type but could not say what the type affects.

### Tutorials in templates

In the review of competitors’ templates I saw that Botmother, after a template is chosen, offers a tutorial that is the same for all templates. I proposed making a tutorial for each template. This hypothesis also went into `MNUX-285`.

It was not confirmed. Respondents had no trouble with templates, and they use them rarely: work tasks need more complex scripts. Instead, all six named something else: the product needs better and more hints, case descriptions in the user guide and onboarding across the whole product for newcomers. The focus shifted from templates to hints in the other sections.

### New interface for the “Robot phrase” block

“Robot phrase” is one of the busiest blocks in the builder: it holds the text, answer recognition, answer options and silence handling. In May 2023 a UX researcher tested on five participants the hypothesis that the block is overloaded and should be split. It was not confirmed: users prefer having all the phrase settings in one place.

In February 2025 I made an updated interface for the block and requested a quick test of it (`MNUX-303`). The researcher ran a survey in Yandex Vzglyad: which of the two options is more modern. 101 people answered. In total, more than 40 % voted for the old option and 22 % for the updated one. The old one was praised for contrasting colors, large buttons and a less crowded page, the new one for a thin font and white space. At the same time, most noted that there was no significant difference between the options. The archive does not say what was decided after the test.

### Competitive reviews

I made four reviews myself and published them in the design department’s knowledge base:

- **Channel management, October 2023.** To connect a chatbot to a channel in Robots, you have to go to another service, Mango Dialogs. Competitors keep connection next to the scripts, and half of them do it right when the bot is created.
- **Chatbot dialogue setup, October 2023.** We handle variables better: the “Add variable” button is labeled in words. Competitors call variables with character combinations. Aimylogic renamed “html markup” to “Text formatting”, and I proposed revising our vocabulary the same way.
- **Script templates, December 2024.** The hypotheses about script types and tutorials in templates came from here.
- **Ordering a turnkey script, February 2025.** In our product, a banner in the script creation dialog changes color on click and nothing else happens: it is unclear which number will be called, and there is no email. Competitors put the order button in a visible place and lead to a form with a task description, so the manager comes to the call already prepared.

### AI robot setup page

When a machine learning model came to Robots, I designed its setup page: knowledge bases, categories, phrases, training, testing and the first introduction to the feature. Details are in the “AI robot setup page” case.

---

## Result

Two of my hypotheses went through testing. The one about script types was confirmed, the one about tutorials in templates was not, and the research showed where to look instead of templates. The new “Robot phrase” interface lost to the old one in the survey. Procedures, routing by business context and the AI robot reached release, as the screenshots and system demos show.

The archive has no figures that would show the effect on the product. The team measures the number of clients, traffic and churn, but the link between these numbers and specific improvements is not recorded anywhere.

---

## Not in the archive

- `[ADD: share of clients who set up a robot themselves, before and after the improvements]`
- `[ADD: time to create the first script, if it started being measured]`
- `[ADD: support requests about the builder]`
- `[ADD: what was decided on script types and on “Robot phrase” after the studies]`
- `[ADD: which MNUX-292 findings reached release: autosave, undo, versions]`

---

## Takeaways

**A product “for everyone” has to be tested on those who did not manage.** Technical specialists said “even a housewife could figure it out”, while people without technical experience quietly went to the paid service.

**“Inconvenient” complaints are worth sorting by cause.** Lost work, silent restrictions and canvas scale are solved by different means, and in one pile they cannot be prioritized.

**It helps to hand your own hypothesis to research, even if it seems obvious.** The hypothesis about script types was confirmed and the one about tutorials in templates was not, although I derived both from the same competitive review.

**A “which option is more modern” survey does not decide the fate of a redesign.** Most respondents saw no difference, and such a question did not show whether the new option is easier to work with. Now I would test the new interface on users’ real tasks.

**Metrics are worth agreeing on before release.** Time to first value could not be measured because the moment of first contact with the product is not recorded anywhere.

---

## Sources

```
01 РОБОТЫ И AI-АССИСТЕНТ/UX-исследования/Роботы. Общее исследование                 MNUX-172, October 2022, 7 clients
01 РОБОТЫ И AI-АССИСТЕНТ/UX-исследования/Исследование _Фраза робота_              MNUX-197, May 2023, 5 participants
01 РОБОТЫ И AI-АССИСТЕНТ/UX-исследования/UI внутри скрипта                        MNUX-292, 32 pages, 8 respondents
01 РОБОТЫ И AI-АССИСТЕНТ/UX-исследования/Роботы. Выбор типа скрипта и использование шаблонов   MNUX-285, 6 respondents
01 РОБОТЫ И AI-АССИСТЕНТ/UX-исследования/Новый UI блока Фразы робота              MNUX-303, 101 people
01 РОБОТЫ И AI-АССИСТЕНТ/Confluence и JIRA/Роботы. Шаблоны скриптов. Анализ конкурентов
01 РОБОТЫ И AI-АССИСТЕНТ/Confluence и JIRA/Роботы. Заказ кастомизированной разработки скрипта
02 ЧАТ-БОТЫ/Confluence и JIRA/Роботы_Чат-боты. Управление каналами; Настройка диалога чат-бота
01 РОБОТЫ И AI-АССИСТЕНТ/Видео и расшифровки/Статистика и метрики/Продуктовые метрики роботы   32 min
_КЕЙС ПОРТФОЛИО (роботы и чат-боты)/15 ПРОДУКТ — всё о роботах и чат-ботах.md     product reference
```

File paths in the archive are given in the original Russian.
