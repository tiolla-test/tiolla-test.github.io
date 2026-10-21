---
kicker: "Chatbots · beta"
chip: "beta sandbox"
tag: "AI assistant"
---

# AI assistant in the chatbot builder

The AI assistant is a block in the chatbot builder. An administrator writes a prompt in it, and a language model runs part of the dialogue by itself. The case is about how to design an interface for a feature that had not a single known use case at launch.

MANGO OFFICE · chatbots · a wrapper over YandexGPT · beta sandbox

---

**Role.** `[ADD]` The records show that the proposal to split the prompt into three fields came from design.

**Team.** The head of product, the engine developer, a UX writer, the implementation team.

**Timeline.** `[ADD: dates]` The beta is free until the end of March.

**Scale.** The block is open to selected accounts through a feature flag, at the implementation team’s request.

**Status.** Beta sandbox. The archive has no results of the beta.

**Sources.** A 2 h 57 min product review, a 59-minute feature critique, three system demos, a meeting with the engine developer. Remarks in the case are edited: filler words and repetitions are removed, the meaning is kept, and they are not verbatim.

---

## In brief

**What was there.** The block’s engine was taken from a neighboring product, Byvoice. The prompt in it was set in one text area. For the assistant to stop, stop words had to be duplicated in the prompt, and this was written only in a tooltip behind a question mark.

**What we did.** We renamed “temperature” to “creativity” and removed the word JSON from the interface. We moved the requirement about stop words under the field and prefilled stop words with default values. We described the block’s behavior in edge states. We added to the statistics the usage that will later be charged for.

**Key decision.** Keep a free-form field for the prompt and not provide ready-made goal templates. There were no known use cases, and any templates would have had to be invented without data.

**Result.** The block shipped as a beta sandbox for selected accounts. The archive does not say which scenarios users brought or what changed after the beta.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. The AI assistant works inside the chatbot, as one of the blocks of a scenario.

*Схема продукта*

---

## Problem

A regular builder block describes what the robot will do. The AI assistant describes how the robot will conduct the conversation. The administrator writes a prompt, and then the model runs part of the dialogue by itself, without branches on the canvas. The block has an input and an output: the dialogue enters the block, the assistant talks until a stop word, the dialogue exits and continues along the scenario.

For a builder where everything else is assembled from visible branches, this is a new entity. The logic inside the block cannot be seen on the canvas.

The interface had to answer five questions:

1. How to show model settings to a person who does not know what temperature and tokens are.
2. How to help write a prompt without turning the block into a code editor.
3. What to do with a condition without which the block does not work.
4. How to present a paid feature while it has no price.
5. How to design a block when its use cases are unknown.

The fifth question made all the others harder.

---

## Constraints

**Engine.** The mechanics were taken from Byvoice, where they already worked.

**Model.** YandexGPT was chosen because the company has a partnership agreement with Yandex. OpenAI could not be used.

**Voice.** For phone calls the model responds too slowly, so the block was made for chatbots only.

**Knowledge base.** The knowledge base was removed from the feature’s name. It turned out there was none and it was unlikely to appear: the platform’s storage is not designed for large texts.

**Usage.** Tokens are written to logs and saved nowhere. In the provider’s cloud, requests from different products are not separated. So usage per client cannot be calculated yet.

---

## Decisions

### Setting names

The “temperature” parameter was renamed to “creativity”. At the review it was explained as the level of imagination: at zero, no imagining at all. And the risk was named right away: at high creativity the model may invent a company name or an address. The renaming was accepted after a conversation with the UX writer.

The engine developer saved the collected data in JSON. The team decided not to show this word to the user: for most clients it sounds intimidating.

### Stop words

Stop phrases are set in a separate section of the block. For the assistant to stop, the same words have to be duplicated in the prompt, otherwise the model will not see them. This was written only in a tooltip behind a question mark. At the critique it was said that almost nobody reads the tooltip.

**Chose** two changes at once. The condition moved from the tooltip into a subheading under the field. Stop words were prefilled with default values: “stop”, “enough”, “quit”, “start over”. A person sees an example and edits a ready list.

**Postponed** a check that would compare the stop words with the prompt text and highlight a mismatch. At the critique it was decided that the first version did not need it. For the future, the idea was recorded to manage stop words as a category of phrases, by analogy with greetings.

### Prompt

There were two proposals at the review. The first came from design: split the prompt into three fields. The first holds the assistant’s role, the second the information it has, the third where and in what form to save the answer. Under the hood, the fields are glued into one prompt.

The second proposal: provide four ready-made goals and a fifth free one, so the person would not have to write anything.

**Rejected.** Ready-made goals. They lower the entry barrier, and the person will not make a mistake.

**Chosen.** A free-form field. The head of product explained: the block is conceived as a flexible tool, and templates would limit it. The team did not know most of the scenarios, and four ready-made goals would have had to be invented without data. Customization was put off until real scenarios are collected.

The cost of the decision is that a person looks at an empty field and does not know what to write. The records do not show what the team did with the three-field proposal.

### Who the block was opened to

The block was opened to selected accounts through a feature flag, at the implementation team’s request. The risk was named at the meeting: if a client writes a poor prompt and tests it on two dialogues, and then something goes wrong with their customers, the product will be blamed.

**Rejected.** Opening the block to everyone marked “beta”, as Figma does. People usually do not hold a beta to account, and this covers the reputational risk.

**Chosen.** A feature flag. The main reason turned out to be usage: any chatbot user can send the model many unnecessary requests, and the company pays for them.

The hypothesis was checked with an implementation team member: clients order paid setup more often than they edit scripts themselves. The risk was deemed manageable. An exception was recorded in advance: Ozon builds scripts itself because its security protocol does not allow bringing in a contractor, and for such clients the block is opened on request.

### Usage statistics

The statistics show the client’s answers, the branch and the assistant’s settings at launch: creativity, message limit, token limit. The goal was named directly: the feature is planned to be monetized, and the user should see their usage in advance. Then the price will not come as a surprise later.

The economics were calculated at the meeting. The implementation team sets up a small script for 20 to 30 thousand rubles. If a client has a thousand requests a day, this sum will not cover the usage, and the company will go into the red.

### Edge states

| Situation | Decision |
|---|---|
| The service is disabled, but the block is in the script | The script goes to the “error” branch |
| Tokens have run out | The same “error” branch |
| How to know the service is connected | A request to our own API before each entry into the block |
| Importing and exporting a script with the block | Allowed regardless of the service, checked at execution |
| Which block to put before the assistant | “Chatbot phrase”, to warn the person that a reply is expected from them |
| The conversation went off topic | The prompt is advised to set a role and steer back to the topic |
| The dialogue is too long | A limit of 50 messages, which was planned to be reduced |

The memory mechanism from the Byvoice engine was not taken. It stores data between dialogues of one person, while one-off requests are expected here.

### The name of the “Process and save the answer” option

The option collects data from the dialogue, processes it with a second prompt and writes it into a variable. At the critique the name was examined: if there is one action, the heading should name it, and the general word “process” fits only when there are several actions. There turned out to be several, and the name was kept. It was also noted there that the option’s tooltip is still unclear.

---

## Result

The block shipped as a beta sandbox for selected accounts. The interface has “creativity” instead of “temperature”, default stop words, the stop word condition under the field, described behavior in edge states, and usage visible in the statistics.

The main problem remained: the feature has no frequent scenario. The implementation team found one general one, “ask three questions and collect the answers”, but at the time of the critique there were no real clients with it. The head of product put it directly: with no known scenarios, there is nothing to test the interface against.

The monetization model, the price and passing token usage from the platform side are not resolved.

---

## Not in the archive

- `[ADD: mockups of the block, the prompt fields, the settings and the statistics screen]`
- `[ADD: how the beta ended and which scenarios users brought]`
- `[CHECK: whether the stop word condition was moved onto the screen]`
- `[CHECK: whether the three prompt fields were built]`

---

## Takeaways

**A name that only someone who knows how the feature works can understand will have to be changed.** Temperature became creativity, NLU became the AI robot, and JSON was removed from the interface. Three cases in one product.

**A condition without which the block does not work has to be shown on the screen.** If the assistant will not stop without stop words in the prompt, this is written under the field.

**Default values explain faster than tooltips.** Four ready stop words immediately show what this is about, and the person only has to adjust them.

**Usage has to be shown before it starts being charged for.** That way the price will not come as a surprise.

**Without known scenarios, templates are invented at random.** A free-form field is harder for the user, but more honest.

---

## Sources

```
Видео и расшифровки/AI-ассистент и GPT/ПБР РОБОТЫ яндекс gpt         2 h 57 min
Видео и расшифровки/AI-ассистент и GPT/Прожарка_аи ассистент              59 min
Видео и расшифровки/AI-ассистент и GPT/СИСТЕМ ДЕМО РОБОТЫ АИ АССИСТЕНТ    34 min
Видео и расшифровки/AI-ассистент и GPT/Роботы. Систем демо аи-ассистент   20 min
Видео и расшифровки/AI-ассистент и GPT/встреча о чат-ботах 2 июня              23 min
```

File paths in the archive are given in the original Russian.
