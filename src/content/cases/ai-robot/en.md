---
kicker: "ROBOTS-5170 · 2025"
chip: "in production"
tag: "AI robot"
---

# AI robot in the robot and chatbot builder

The AI robot determines the meaning of a client’s phrase with a machine learning model. Before it, the robot compared phrases with keyword dictionaries and made mistakes on live clients even with an exact match. The case is about how the model works, which interface requirements follow from that, and how the release differs from the brief.

MANGO OFFICE · robots and chatbots · 2025 · task `ROBOTS-5170`

---

**Role.** Assignee on task `ROBOTS-5170`. `[ADD: what I did myself]`

**Team.** The engine developer, the product team, the implementation team.

**Timeline.** Product review in June 2025, closed beta from September to December 2025, system demo on 10 October 2025.

**Scale.** The design brief has three knowledge bases, 30 categories per base and 30 phrases per category. One model takes about 2 GB of memory.

**Status.** In production. In the interface the feature is called “AI robot”, and since October 2025 it works in chatbots.

**Sources.** Two meetings with the engine developer, 31 and 27 minutes long, five recordings of the product review from June 2025, the system demo of 10 October 2025. Remarks in the case are edited: filler words and repetitions are removed, the meaning is kept, and they are not verbatim.

---

## In brief

**What was there.** The robot recognized a client’s answer by keyword dictionaries. The engine dropped word endings and, on a live client, picked a similar phrase instead of the exact one. The client fixed this by hand, adding hundreds of ending variants to the dictionary.

**What we did.** A classification model with a confidence threshold, color marking of phrases and separate training. Keywords stayed as a fallback for when the model is not sure. In the chatbot, an answer can be processed by the model, the scenario can branch by category, and it can be checked on a separate test page.

**Key decision.** The limits were cut compared to the June review: categories per base went from 100 to 30. At the review this was discussed as a question of load and convenience, and the engine developer later explained the technical reason: the more similar categories there are, the more often the model makes mistakes.

**Result.** The feature is in production and is called “AI robot”. The decisions from the June review reached the release almost unchanged. The statistics show which phrase and category the model found and with what match percentage. The closed beta took in 60 clients against a target of 100.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. The AI robot works inside the voice robot and the chatbot: it determines which category a client’s answer belongs to and leads the dialogue down the right branch.

*Схема продукта*

---

## Problem

The task brief describes the problem in general terms. The records have a specific case from production, and it explains the problem well.

When comparing, the engine drops word endings. A client who delivers water had the phrases “water delivery”, “deliver water” and “delivered water” in the script. When a person said “delivered water”, the dialogue always went to “water delivery”, even with a full match to the third phrase. After the endings were dropped, the first option had more similar words, and the exact match lost to the approximate one. This cannot be fixed with a setting; that is how the mechanism works.

The client fixed this by hand and added a huge number of ending variants to the dictionary. The old intent mechanism did not help either, because it ignores endings. A “strict comparison” checkbox was discussed, but it was rejected: all endings would have to be listed, and if even one were forgotten, the robot would start losing clients. In the end, the implementation team rebuilt this client’s script.

---

## How the model works

This information came from meetings with the engine developer. It was not available at the June product review. Yet the interface requirements depend on it.

### Keywords

The model works first. If it cannot choose a category, a keyword search kicks in automatically. The developer explained why: a person must have a reliable way to get a reaction to an exact phrase.

Hence the interface requirement. Keywords need to be shown as a layer beneath the model. They do not replace the model and are not a legacy mode.

### Confidence threshold

The default threshold is 30 percent; the value was found by experiment. The developer compared the threshold to a thermometer: if you set it to 90 percent, the model will refuse to assign a phrase to a category when, by its calculations, the match is only 38 percent. The threshold protects against cases where a phrase fits several categories by 2 to 3 percent and essentially belongs to none.

### Phrase colors

| Color | Meaning |
|---|---|
| Green | The model confidently assigns the phrase to this category |
| Yellow | Confidence is below the threshold; the phrase is not used at runtime |
| Red | A labeling error; the phrase fits another category better |

The colors are needed during labeling, to find errors. So they must be visible at the moment phrases are entered. In a report that a person opens later, they are of little use.

### Training and training errors

The interface has two buttons: “Save” and “Train”. Without training, only keywords work. After phrases are edited, a “Training available” button appears; there is no separate retraining mode.

Training can fail for three reasons: too few phrases, too few categories or too many categories. The engine does not say which one it was. Hence a requirement that was not discussed at the review: a training error message must name all three options. A phrase like “not enough data” would leave the person guessing.

### Classification method

In the brief, the classification method is a dropdown with one available option. The reason is technical. The second algorithm, spaCy, could not be launched in a container, and training it requires a graphics card that the production servers do not have. In effect, two mechanisms work: the model and keywords.

A list with one item looks odd, but it honestly shows the state of the platform: one method works right now.

---

## Limits

In June the limits were discussed in terms of server load and interface convenience. The main argument came later, at a meeting with the engine developer: the more similar categories a base has, the harder it is for the model to tell them apart and the more often it makes mistakes. The second constraint is memory: one model takes about 2 GB, and when there are 20 to 30 of them, they will have to be loaded and unloaded in turn.

| | Review, June | Design brief | Release |
|---|---|---|---|
| Knowledge bases | 10 | 3 | `[to clarify]` |
| Categories per base | 100 | 30 | `[to clarify]` |
| Phrases per category | 500 | 30 | `[to clarify]` |
| Characters per phrase | 300 | 100 | `[to clarify]` |

The cut is technically justified. It has a consequence for the interface: with thirty phrases per category, importing from CSV stops being urgent. The engine developer already has import from CSV and Excel working, but it did not make it into the scope.

---

## Result

At the system demo on 10 October 2025 the feature was already called “AI robot”, and the abbreviation NLU remained an internal name. There was one goal for the quarter: add the AI robot to chatbots.

The decisions from the June review reached the release almost unchanged.

| Decision in June | In the release |
|---|---|
| A choice when processing an answer: reference list or model | Done in the “Chatbot phrase” block, on the “Answer processing” tab |
| A form like in the voice robot | The form repeats the voice robot |
| First the knowledge base, then the categories | You can choose an AI robot and its categories, or all at once |
| A branch for each category and a common branch | If the selected category is found, the dialogue follows its branch; if another category of the AI robot is found, it follows the common one |
| A window for testing | The chatbot got more: a separate test page with a chat |

The statistics started working, although in June there were doubts the data could be obtained. They show the sent text, the matching phrase and category, the chosen branch and the match percentage. At the demo, one example gave 92 percent, and transfer to a specialist about 65. A defect was also admitted there: one of the categories worked incorrectly.

The closed beta ran from 8 September to early December 2025 and took in 60 clients against a target of 100. Only those with the contact center and robots connected were invited.

---

## What did not make it into the product

**Unprocessed phrases.** The engine can accumulate phrases that matched no category and show them as a list. Categories and keywords could be replenished from them. This would close the hardest setup question: where to get phrases for training. The mechanism did not make it into the scope.

**Connection with speech analytics.** It was discussed to take categories from the neighboring product instead of labeling by hand. But in speech analytics the topic is set for the whole conversation, while here it is needed for each phrase. The connection was not included in the scope.

---

## Not in the archive

- what the closed beta showed, apart from the number of participants;
- the final limits;
- the results of the research that was the feature’s first task.

---

## Takeaways

**A real failure at a client explains the task better than the brief.** A client who added endings to a dictionary by hand shows both the problem and the cost of the workaround.

**A color that helps with labeling must be visible during labeling.** In a report it will no longer help.

**If the system does not know the cause of an error, the message must name all possible ones.** The engine does not distinguish what was missing, so the interface lists all three options.

**A technical limit can be the best argument for a small limit.** The argument “the more categories, the worse the model” is more convincing than talk about convenience. The review lacked it.

**A list with one item can stay if it shows the real state of the platform.** Here it tells the user that there is only one classification method for now.

---

## Sources

```
Видео и расшифровки/NLU (ROBOTS-5158, 5170)/Роботы. ML                31 min
Видео и расшифровки/NLU (ROBOTS-5158, 5170)/Роботы. Интенты           27 min
Видео и расшифровки/NLU (ROBOTS-5158, 5170)/5 записей ПБР, июнь 2025  8 h 10 min
Видео и расшифровки/Демо осень 2025 (бета NLU)/Систем демо 2025-10-10
Видео и расшифровки/Опознано по первым минутам/NLU в чат-ботах, 10.10.2025
04 РЕЧЕВАЯ АНАЛИТИКА/UX-исследования/Настройки РА новый дизайн.pdf
```

File paths in the archive are given in the original Russian.
