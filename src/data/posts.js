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
  }
]