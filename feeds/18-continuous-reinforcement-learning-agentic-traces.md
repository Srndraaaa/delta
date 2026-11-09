---
id: "continuous-reinforcement-learning-agentic-traces"
readers: 0
title: "Online Direct Preference Optimization (DPO) from Production Agent Trajectories"
date: "2026-10-18"
author: "Dr. Nikolai Volkov"
category: "Alignment"
tags: ["DPO", "Reinforcement Learning", "Agent Trajectories", "Fine-Tuning"]
readingTime: "5 min read"
summary: "Mining successful and failed agent execution trajectories in production to continuously fine-tune base reasoning models without manual reward modeling."
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
---

# Online Direct Preference Optimization (DPO) from Production Agent Trajectories

Pre-trained frontier models often fail at the nuances of specific corporate codebases or API idiosyncrasies. Fine-tuning models with hand-crafted human feedback (RLHF) is prohibitively slow for fast-evolving agent workflows.

This dispatch details an **Online Trajectory Mining and Direct Preference Optimization (DPO)** pipeline that leverages real unit test passes and compiler outcomes as unsupervised ground-truth labels.

---

## 1. Automatic Preference Pair Generation

Whenever an agent attempts a task, multiple candidate reasoning paths are logged:
- **Winning Trajectory ($y_w$):** Passes all linter checks, compiles without errors, and passes CI test suites on the first attempt.
- **Losing Trajectory ($y_l$):** Suffers from infinite loops, hallucinated tool arguments, or test failures.

```
Pair Definition:
Prompt (x): "Fix CVE-2026-4102 in cryptographic padding routine"
Winner (y_w): Verified constant-time comparison patch (Tests pass)
Loser  (y_l): Vulnerable timing-attack patch (Test assertion fails)
```

---

## 2. DPO Loss Formulation on Agentic Paths

Instead of training an auxiliary reward model, we optimize policy $\pi_\theta$ directly against reference policy $\pi_{ref}$:

$$\mathcal{L}_{DPO}(\pi_\theta; \pi_{ref}) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)} \right) \right]$$

---

## 3. Measurable Alignment Gains

After 4 iterations of continuous offline trajectory ingestion:
- **Zero-Shot Task Pass Rate:** Improved from **61.2%** to **84.9%** on internal SWE benchmarks.
- **Hallucinated Tool Calls:** Decreased by **73%** as the model learned exact parameter constraints through negative reinforcement.
- **Inference Efficiency:** Trajectories shortened by an average of 4 turns as the agent ceased generating redundant conversational filler.
