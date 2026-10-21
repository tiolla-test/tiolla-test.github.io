---
kicker: "Robot administrator"
chip: "decisions made"
tag: "webhooks"
---

# Webhooks in the robot administrator

The robot administrator polled an external system on a schedule, every ten minutes, and most requests came back empty. A webhook reverses the connection: the external system itself tells the robot it is time to call. The case is about where to put the setup, what to do with the schedule, and why the team rejected three of the client’s four requirements.

MANGO OFFICE · robot administrator · receiving incoming webhooks

---

**Role.** `[ADD]` According to the records, design had two tasks: where to set up parameter mapping and how to show the job queue.

**Team.** The feature’s requester, the engine developer, the integration team and the product team. Decisions were made at four working meetings.

**Timeline.** Four meetings, about five hours of recordings. `[ADD: dates]`

**Scale.** A robot administrator costs 10,000 ₽, and an account can have three of them. The main external systems in scenarios are Bitrix and AmoCRM.

**Status.** Decisions were made at the meetings. The recordings do not show which of them made it into the release.

**Sources.** Transcripts of four meetings. Remarks in the case are edited: filler words and repetitions are removed, the meaning is kept, and they are not verbatim.

---

## In brief

**What was there.** The robot administrator went to the external system on a schedule, every ten minutes. Reacting to an event took up to ten minutes, and most requests came back empty.

**What we did.** Receiving incoming webhooks. The URL and method are set in the robot card, and the mapping of parameters to variables in the builder. If a webhook is set up, the robot works around the clock. The statistics show the original hook so it can be debugged.

**Key decision.** The team checked and rejected three of the client’s four requirements: an API key, a configurable parameter separator, and ready-made templates for Bitrix and AmoCRM. The interface got shorter as a result.

**Result.** The architecture and the interface were agreed at the meetings. An idea emerged for a “Test” button that turns debugging into the main way of setting things up. The recordings do not show what made it into the release.

---

## Place in the product

Robots brings together five MANGO OFFICE entities: the voice robot, the chatbot, the robot administrator, the AI robot and the AI assistant. Scripts for all of them are built in a visual builder, without programming. In this family, the robot administrator works without dialogue: it takes data from the CRM, prepares call campaigns and monitors them. Webhooks are needed specifically for it.

*Схема продукта*

---

## Problem

The robot administrator polled the external system on a schedule, every ten minutes. This scheme has two drawbacks. The robot learns about an event after five minutes on average, and after ten at worst. And most requests return “nothing here”, so polling more often is not an option: there would be even more empty requests.

The target scenario is this. In Bitrix, a lead moves to the right stage of the funnel. Bitrix immediately sends a hook with the client’s data. The robot receives it, passes it to a call campaign, and the call begins.

---

## Users

The robot builder is designed for an administrator without a technical background. With webhooks, it turned out differently. At a meeting it was said directly that no clients could be found to talk to and that this is “mainly an integrator case”. Webhooks will be set up by integrators, essentially developers, or the client will order a turnkey setup.

An attempt to simplify the interface was dropped at the same meeting. To the question of whether the builder could be made without a URL, the answer was a counter-question: how would you do it without a URL.

This defined the design. The user knows what POST, JSON and request parameters are. Predictability matters more to them than hints for a beginner.

There was also a strategic goal. The requester wanted to turn the robot into something like Albato, only more flexible: connecting any systems with an open API. At the meeting it was said that a few skilled staff could build templates and release thousands of integrations without a developer.

---

## Constraints

**Pricing.** A robot administrator costs 10,000 ₽, and an account can have three. Nobody will attach a separate robot to each webhook. At the meeting it was put this way: adding a phone number to a table would cost ten thousand. For comparison, in Bitrix the internal robots are included in the plan, you can set up as many as you like, and Bitrix itself costs about 5,590 ₽ a month for 50 users.

Pricing had a second side. If one robot were allowed to receive hooks for different scenarios, robot sales would fall, and this was said directly. The sales department, for its part, replied that managers had been allowed to give discounts.

**Variable limit.** A robot has 50 variables. The contractor Svyaz 24 hit this limit back in December. No requests to extend it came to support, but the team itself doubted that this proves anything: such requests may simply get lost.

**One logic per robot.** A robot cannot work on a schedule and receive hooks at the same time. First the parameters arrive, then the script runs on them, and these cannot be combined in one logic.

**Engine.** In the engine developer’s version, a webhook only calls a script by link and does not accept parameters. Parameters need their own gateways.

---

## Decisions

### Where to set up the webhook

**Rejected.** Putting the whole setup in the robot card, next to the schedule. Everything in one place.

**Chosen.** Splitting the setup across two places. The robot card holds the URL and method, so the script can start. The builder holds the mapping: which parameters to take and which variables to write them into.

The reason was named at the meeting. The card would have held the schedule, the hook, a list of fields and variables, while a person creates variables in the builder. They would have had to go back and forth between two places, and that would not have been obvious. Hence the rule: a setting lives next to the data it works with.

The robot administrator also got a script type: incoming or outgoing request, by analogy with incoming and outgoing calls for voice robots. In an incoming script, the reworked HTTP request block comes first.

### Schedule

The feature’s requester believed the schedule was unnecessary here: if the external system decided to send a hook, it should be processed at any time. In the engine, however, the webhook was also tied to the schedule, and a hook that arrived outside working hours went into a queue.

At the meeting we found out where this tie came from. The webhook was going to be attached to the robot administrator, and the robot was needed only for the schedule. Because of the robot’s price, nobody will set up a separate robot for a webhook.

**Rejected.** Keeping the schedule working alongside the webhook and accumulating jobs in a queue until working hours begin.

**Chosen.** If a webhook is set up, the schedule becomes inactive and is set to 24/7. If no webhook is set up, the schedule works as before. If clients ask for a schedule together with a webhook, the team will return to the question of the queue.

The decision was checked with clients: the two clients interviewed had no scenario that needed a schedule. Bitrix itself decides when to send a hook. For scenarios like routing by time zone, the proposal was to make the schedule a block inside the script.

### Job queue

While the schedule is limited, an incoming hook waits in a queue, and the user sees this nowhere. The statistics show only completed jobs.

The team discussed a counter of queued jobs without details. It was immediately objected that the user would not see the number until they opened the window, and it was unknown whether they needed it at all. The question was never resolved, and this became another argument for 24/7 mode: otherwise a queue screen would have to be designed whose content nobody could agree on.

### The client’s rejected requirements

**API key.** The requester asked to add authorization. But the webhook URL already contains a unique hash. If the URL leaks, it is reissued. A key would leak the same way, and the same would have to be done with it. A key would add a field to the interface and would not add protection.

**Configurable parameter separator.** The requester believed that Bitrix and AmoCRM pass parameters with different separators. The team checked: both use the same separator, the ampersand. Systems with a different separator did occur, but the integration team called them home-made and rare. The setting was removed from the first stage.

**Templates for Bitrix and AmoCRM.** Templates would have made setup easier for the most common systems. The team declined because the goal was to build a universal tool not tied to a specific system. The cost of this decision is that the client writes everything by hand.

### Debugging

An integrator sets up a webhook, sends a test hook and looks at what arrived. So it was decided to show four things in the statistics:

- the full original hook, behind a “More” button, as with the HTTP request block;
- what was written into the variables according to the mapping;
- specifically the original request, because the system may convert GET to POST;
- storage for no longer than seven days, as with the HTTP request.

This requires a proxy application that converts an incoming hook into the engine’s format and stores the original.

At the third meeting the idea of a “Test” button appeared. A person presses it, sends a real hook and picks the needed fields with the mouse, and the system writes the paths to them itself, as in the HTTP request block. The developer confirmed this could be done. With such a button, debugging becomes the main way of setting things up: there is no need to guess the format and write paths by hand.

---

## Result

At the meetings the team agreed on the main points:

- URL and method in the robot card, parameter mapping in the builder;
- an “incoming request” script type;
- 24/7 mode for a robot with a webhook;
- three of the client’s requirements rejected, a shorter interface;
- the original hook in the statistics for debugging, and the idea of a “Test” button.

The pricing question stayed open. The recordings do not show which decisions made it into the release.

---

## Not in the archive

- `[ADD: mockups of the hook receiving block, parameter mapping and statistics with the original hook]`
- `[ADD: whether the “Test” button was built]`
- `[ADD: the pricing decision]`
- `[CHECK: whether the “incoming request” script type was introduced]`

---

## Takeaways

**A setting is worth placing next to the data it works with.** Variables are created in the builder, so parameter mapping is there too, even though the URL stays in the robot card.

**A client requirement is worth checking before drawing a field for it.** Three of the four requirements did not pass the check, and the interface got shorter.

**Pricing affects design as much as the engine does.** As long as a robot costs ten thousand and there are three of them, each webhook cannot be tied to one.

**Debugging can become the main way of setting things up.** A button that brings in a real hook and lets you pick fields with the mouse removes the guesswork about the format.

---

## Sources

```
Видео и расшифровки/Вебхуки/РОБОТЫ_ ПБР вэбхуки 1        47 min
Видео и расшифровки/Вебхуки/РОБОТЫ_ ПБР вэбхуки 2       182 min
Видео и расшифровки/Вебхуки/РОБОТЫ_ ПБР вэбхуки 3        61 min
Видео и расшифровки/Вебхуки/РОБОТЫ_ ПБР вэбхуки 3 ч2      8 min
```

More than half of the “вэбхуки 2” and “3 ч2” recordings is about other backlog tasks: date conversion for a restaurant client, sending an SMS to a number from a variable, integration with the address book, moving the variable list to design system components. File paths in the archive are given in the original Russian.
