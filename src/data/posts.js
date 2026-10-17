export default [
  {
    slug: 'dsp-crf-filling-2026',
    title: 'DSPy modular extractors for CRF filling',
    excerpt: 'Descomponer 134 campos clínicos en 14 extractores especializados con DSPy y Pydantic. Cómo la modularidad bate al escalado de parámetros.',
    date: '2026-09-01',
    tags: ['nlp', 'dspy', 'clinical-nlp'],
    readingTime: 8,
    body: `# DSPy modular extractors for CRF filling

Extracting structured clinical fields from unstructured EHR notes is a foundational task in medical informatics. The challenge: 134 fields, strict None-vs-False semantics, and models that hallucinate when given too much at once.

## The approach

Instead of one monolithic LLM call, we partition the schema into 14 domain-specific extractors. Each runs independently with its own DSPy signature, Pydantic-validated output, and Chain-of-Thought reasoning.

\`\`\`python
class ExtractLabValues(dspy.Signature):
    """Extract laboratory test results from the clinical note.

    CRITICAL RULES:
    - Return ONLY the numeric value as a short string
    - NEVER include label prefixes like "WBC", "CRP", "Hb"
    - None if the lab test is not mentioned
    """
    clinical_note: str = dspy.InputField()
    lab_values: LabValues = dspy.OutputField()
\`\`\`

## Key insight

The distinction between None (not mentioned) and False (explicitly absent) is the single most important factor. Getting this right in the prompt docstring moved F1 from 0.67 to 0.70 — more than any model scaling did.

## Results

Macro-F1 of 0.68 (EN) and 0.67 (IT) on the official Codabench test set. First place overall.`
  },
  {
    slug: 'reranker-research-notes',
    title: 'Listwise reranking with DSPy on BEIR',
    excerpt: 'Notas de investigación sobre listwise rerankers, optimización con MIPROv2, y por qué el metric-as-variable cambia el juego.',
    date: '2026-08-15',
    tags: ['research', 'reranking', 'ir'],
    readingTime: 12,
    body: `# Listwise reranking with DSPy on BEIR

Reranking is the bridge between first-stage retrieval and final user-facing results. Most work uses pointwise or pairwise approaches. Listwise reranking treats the entire candidate set as one unit.

## Why DSPy matters here

Traditional prompt engineering for reranking is fragile. DSPy lets you define a signature, optimize few-shot demos automatically, and iterate on the metric — not the prompt.

\`\`\`python
class RerankSignature(dspy.Signature):
    """Given a query and a list of passages, rank them by relevance."""
    query: str = dspy.InputField()
    passages: list[str] = dspy.InputField()
    ranked_ids: list[int] = dspy.OutputField()
\`\`\`

## MIPROv2 parameters that matter

- \`max_bootstrapped_demos\`: 4
- \`max_labeled_demos\`: 5
- \`num_candidate_programs\`: 10-15
- \`init_temperature\`: 0.7

Higher candidate counts help but cost scales linearly. The sweet spot for BEIR-sized eval sets was 12 candidates.

## Lessons

1. The metric you optimize against should be the one you evaluate on, not a proxy
2. Listwise > pairwise when the list is short (<20 docs)
3. Temperature 0.0 for inference, 0.7 for optimization`
  },
  {
    slug: 'ollama-local-setup',
    title: 'Running models locally with Ollama',
    excerpt: 'Configuración de Ollama para inference local: glm-5.2, mistral, gemma. Trucos de cuantización y context window.',
    date: '2026-07-20',
    tags: ['ollama', 'llm', 'local'],
    readingTime: 6,
    body: `# Running models locally with Ollama

Local inference has gotten remarkably good. Here's my setup.

## Model selection

- **glm-5.2** — daily driver, best quality/size ratio
- **mistral:latest** — fast, good for code generation
- **gemma4:12b** — strong multilingual, especially Spanish

## Context window trick

\`\`\`bash
ollama run mistral --context-size 8192
\`\`\`

This is critical for RAG pipelines. The default 2048 is too small for most real-world tasks.

## Quantization

Q4_K_M is the sweet spot. Q8 is marginally better but 2x the size. Q3 starts losing reasoning ability.`
  },
  {
    slug: 'agentic-systems-exploration',
    title: 'Exploring the vertex of agentic AI',
    excerpt: 'Notas sobre sistemas agénticos, nuevos flujos de trabajo con LLMs, y dónde está el frontera de la IA generativa en producción.',
    date: '2026-08-28',
    tags: ['llm', 'agents', 'generative-ai'],
    readingTime: 7,
    body: `# Exploring the vertex of agentic AI

Working with generative AI at scale means moving beyond single-prompt calls. Agentic systems — where LLMs orchestrate tools, reason over multi-step flows, and self-correct — are where the real frontier is.

## What changes with agents

Traditional ML: you train a model, deploy it, it predicts. Done.

Agentic AI: the model decides what to do, calls tools, observes results, and iterates. The prompt is no longer a static instruction — it's a program.

## Key patterns I'm exploring

- **ReAct**: reasoning + acting in interleaved loops
- **Tool-augmented generation**: LLMs calling APIs, databases, code interpreters
- **Multi-agent orchestration**: specialized agents collaborating on complex tasks

## The challenge at production scale

At Santander, the bar for reliability is high. Agentic systems that work in demos often fail in production because:

1. Tool calls have side effects that compound errors
2. Latency multiplies with each reasoning step
3. Evaluation is harder — you can't just check the final output

The vertex of AI isn't a bigger model. It's better orchestration.`
  },
  {
    slug: 'what-42-cycles-of-multi-agent-failures-taught-me',
    title: 'What 42 Cycles of Multi-Agent Failures Taught Me',
    excerpt: 'Post-mortem de un laboratorio de 16 agentes LLM que se auto-gobernó durante 42 ciclos: jueces que validaban al nivel del azar, parches que destruían la persistencia, y el 41% de tokens que se iban solo en re-inyectar memoria.',
    date: '2026-10-17',
    tags: ['llm', 'agents', 'multi-agent', 'post-mortem'],
    readingTime: 14,
    body: `# What 42 Cycles of Multi-Agent Failures Taught Me

Between September 12 and October 17, 2026, I ran 42 autonomous cycles of a 16-agent LLM research firm. The system had a Coordinator, three researchers, a testing crew (designer/runner/auditor), adversarial reviewers, a statistician, a meta-team that patched its own source code, and a real LLM-as-judge panel. It spent 1,655,582 tokens. It produced 17 blog posts. It refuted more claims than it validated.

This is not a success story. This is the post-mortem.

---

## Failure 1 — The judge panel that could not judge

The goal was an LLM-as-judge framework for evaluating answers against ground truths. We surveyed OpenAI Evals, Anthropic Constitutional AI, G-Eval, MT-Bench, JudgeBench. We built a 3-judge panel with CoT prompting, rubric-based scoring, and bias controls.

Cycle 21 validation: **Kendall-Tau ≈ 0.09** against known labels. The pipeline was essentially guessing.

Cycle 25, second attempt with self-consistency voting: **50% label accuracy** on a 4-choice task — exactly chance level.

The component-level metrics looked fine (Cohen's κ = 0.82 agreement). But agreement among judges is not correctness against ground truth. Three judges confidently agreeing on the wrong answer is still a wrong answer.

**What saved us:** a validation ladder that separates *internal consistency* from *external validity*. The statistician demotes any claim with n<3 replicas, empty metrics, or wild variance. Adversarial reviewers check methodology and generalization. The verdict REFUTED is a first-class outcome, not a failure.

---

## Failure 2 — The meta-team tried to delete persistence

The meta-team (observer + developer) can patch non-structural source files autonomously. Twice, they attempted to "optimize" the system by replacing disk-backed state with in-session dictionary caches.

Both times, the regression tests caught it and the system reverted via \`git checkout\`.

If I had not written persistence regression tests that spawn subprocesses and verify round-trip state, the firm would have silently lost its memory between cycles. Self-modifying code is only safe when you treat every patch as an attempted exploit.

**Pattern:** three gates — AST parse before apply, full pytest after apply, git revert on red. Never let an LLM hand-write unified diffs; use find-replace edits and compute the diff yourself.

---

## Failure 3 — 41% of tokens spent re-injecting context

Across six cycles, we audited token spend. The single largest waste: **memory re-injection consumed ~41% of input tokens**. Agents were re-reading their own history, the public ledger, and skill files on every call.

Hierarchical summarization cut this by ~22%. Procedural memory (SKILL.md files auto-written from decisive verdicts, injected only when trigger keywords match) reduced it further.

The lesson: multi-agent systems do not fail because the models are weak. They fail because every agent pays a "coordination tax" — re-reading context, re-stating goals, re-verifying what others already verified. A 5-agent mesh has 10 channels; a 10-agent mesh has 45. Coordination overhead exceeds 30% of total budget in typical hub-and-spoke designs.

---

## Failure 4 — Reasoning models drown before they emit JSON

Half the model pool (gpt-oss:120b, qwen3.5, glm-5.2) are chain-of-thought reasoners. They reason beautifully, then exhaust max_tokens before emitting the final JSON. For three cycles, the observer returned empty responses and scored everything 50/100 by default.

Fixes that worked:
- Two-phase flow: tiny schema first (scores), detail second.
- "Emit JSON immediately, no reasoning in output" as the **first** line of every JSON prompt.
- Extract the **last** top-level JSON object, not the first.
- Auto-repair truncated JSON by counting unclosed brackets and appending.

Hand-written unified diffs always fail. Line counting is unreliable; escape debris like \`"}\` tails corrupt patches. We switched to find-replace with exact-match validation (each 'old' string must occur exactly once, or abort all-or-nothing).

---

## Failure 5 — The one-character bug that killed the validation ladder

The peer-review prompt was built with \`.format(angle)\` after f-strings resolved. Literal JSON braces became format placeholders. \`KeyError: '"claim"'\` killed the ladder exactly when the first VALIDATED verdict arrived.

Never \`.format()\` a prompt that contains JSON braces. Concatenate.

A second key-mismatch bug: the statistician read \`r['stdout']\` but reports persisted \`'stdout_tail'\`. A real VALIDATED was demoted to INCONCLUSIVE on "empty stdout". When a consumer sees empty evidence that the producer clearly wrote, check the key mismatch first.

---

## What the system got right

After 42 cycles, the framework measures for real. Cycle 33 refuted a claim that **understated** panel agreement (ICC 0.984 measured vs ~0.78 claimed). The validation ladder caught an error in the conservative direction — it does not rubber-stamp.

The convergence loop (auditor objections → claim owner reformulates, max 2 rounds) prevents hollow INCONCLUSIVE verdicts. REFUTED is a fine outcome; 21 of 42 cycles ended in refutation or required reformulation.

The budget system is observability-only: it tracks every token per agent per purpose, never refuses, never trims. This was a deliberate Director decision (cycle 40) — you cannot fix what you cannot see.

---

## The numbers

| Metric | Value |
|---|---|
| Total cycles | 42 |
| Total tokens | 1,655,582 |
| Blog posts generated | 17+ |
| Decisive verdicts (VALIDATED + REFUTED) | ~60% |
| REFUTED verdicts | 21 |
| Persistence regression tests | 2 |
| Meta-patches applied | 23 |
| Meta-patches reverted | 4 |

---

## What I would tell someone building this today

1. **Do not build a general agent framework.** Build the validation ladder first. If you cannot tell a REFUTED from a VALIDATED, you do not have a system — you have a demo.

2. **Reasoning models need two-phase JSON and emit-immediately instructions.** Anything else burns tokens on reasoning you never see.

3. **Persistence is sacred.** Anything disk-backed must stay on disk. In-session caches are read-through/write-through only. Test it with subprocesses.

4. **Coordination overhead dominates at scale.** Your 10th agent does not add 10% more capability; it adds 45 more context channels. Measure token spend per agent per purpose from day one, or you will drown in your own context.

5. **REFUTED is a result.** If your system cannot produce a decisive negative verdict, it cannot produce a trustworthy positive one either.

The code is private. The lessons are not. I will publish the next set of post-mortems as the cycles continue — including the ones where the firm votes to fire itself.`
  }
]