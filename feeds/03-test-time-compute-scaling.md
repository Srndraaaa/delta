---
id: "test-time-compute-scaling"
readers: 0
title: "Test-Time Compute Scaling & Tree Search in Coding Agents: Benchmark Analysis"
date: "2026-11-03"
author: "Delta Research Lab"
category: "Reasoning"
tags: ["Test-Time Compute", "MCTS", "Code Generation", "Reasoning"]
readingTime: "6 min read"
summary: "Exploring Monte Carlo Tree Search (MCTS) and test-time verification loops to dramatically boost problem resolution in complex codebase migrations."
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
badge: "Reasoning"
---

# Test-Time Compute Scaling & Tree Search in Coding Agents: Benchmark Analysis

Scaling pre-training compute yields diminishing returns per gigawatt hour. Conversely, **scaling inference-time compute**—giving models more tokens and structured search pathways during problem solving—exhibits exponential performance improvements on code benchmarks.

---

## 1. Monte Carlo Tree Search (MCTS) for Refactoring

Rather than generating a linear sequence of edits, our agent branches across hypothesis spaces:

```
               [Root: Bug Ticket]
              /        |         \
         [Plan A]   [Plan B]   [Plan C]
           /  \        |          |
       [Rollout 1] [Rollout 2] [Rollout 3]
            │          │          │
         (Tests Fail) (Tests Pass) (Linter Fail)
```

By scoring intermediate checkpoints with local test runners (e.g., `pytest`, `cargo test`, `vitest`), the agent prunes erroneous exploratory paths before committing changes.

---

## 2. Quantitative Results

We tested a 14B parameter model equipped with 4-way branch MCTS against unguided 70B parameter models:

- **SWE-bench Lite:** 14B + MCTS scored **54.8%**, surpassing 70B zero-shot (**42.1%**).
- **Inference Latency:** Average 45 seconds per task resolution.
- **Compute Efficiency:** 60% lower dollar cost compared to API calls on frontier monolithic models.

---

## Conclusion

Test-time compute scaling proves that thoughtful orchestration and deterministic feedback loops beat raw parameter size for complex software engineering tasks.
