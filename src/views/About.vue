<script setup>
</script>

<template>
  <div class="about-snap">
    <!-- About panel -->
    <section class="panel about-panel">
      <div class="about-content">
        <p class="hero-prompt mono text-tertiary">
          <span class="prompt-char">$</span> cat about.md
        </p>
        <h1 class="hero-title">About</h1>

        <div class="about-text">
          <p>
            I'm Javier Morenosa, an NLP/IR researcher focused on
            <strong>listwise reranking</strong> with DSPy and
            <strong>clinical information extraction</strong>.
          </p>

          <p>
            My repos include
            <a href="https://github.com/Javier-Morenosa/reranker-research" target="_blank" rel="noopener">reranker-research</a>
            (listwise reranker + DSPy on BEIR) and
            <a href="https://github.com/Javier-Morenosa/classifier-optimizer" target="_blank" rel="noopener">classifier-optimizer</a>
            (metric-as-variable study).
          </p>

          <p>
            I work with Ollama Cloud (glm-5.2 preferred) and local models
            (Mistral, Gemma). Currently exploring how modular LLM pipelines
            with strict Pydantic validation can improve clinical NLP tasks.
          </p>
        </div>

        <p class="scroll-hint mono text-tertiary">
          <span class="prompt-char">$</span> scroll ↓ for contact
        </p>
      </div>
    </section>

    <!-- Contact panel -->
    <section class="panel contact-panel">
      <div class="contact-content">
        <p class="panel-label mono text-tertiary">
          <span class="prompt-char">$</span> contact
        </p>
        <ul class="contact-list mono">
          <li>
            <span class="contact-key text-tertiary">github</span>
            <a href="https://github.com/Javier-Morenosa" target="_blank" rel="noopener">@Javier-Morenosa</a>
          </li>
          <li>
            <span class="contact-key text-tertiary">email</span>
            <a href="mailto:javiersanchezmoreno2@gmail.com">javiersanchezmoreno2@gmail.com</a>
          </li>
        </ul>
        <RouterLink to="/" class="back-link mono text-accent">
          ↑ back to posts
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.prompt-char {
  color: var(--accent);
  margin-right: 0.4rem;
}

.about-content {
  max-width: var(--max-width);
  text-align: center;
}

.hero-prompt {
  font-size: var(--font-size-sm);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-bottom: 2.5rem;
}

.about-text {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 560px;
  margin: 0 auto;
}

.about-text a {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--glass-border-hover);
  transition: text-decoration-color 0.2s ease;
}

.about-text a:hover {
  text-decoration-color: var(--accent);
}

.scroll-hint {
  font-size: var(--font-size-xs);
  margin-top: 3rem;
  animation: bob 2s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(6px); opacity: 1; }
}

/* ── Contact ────────────────────────────────────────── */
.contact-content {
  max-width: 480px;
  text-align: center;
}

.panel-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.contact-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: var(--font-size-sm);
}

.contact-list li {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: baseline;
}

.contact-key {
  min-width: 60px;
  text-align: right;
}

.back-link {
  font-size: var(--font-size-sm);
  display: inline-block;
  margin-top: 3rem;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .about-text {
    font-size: var(--font-size-base);
  }
}
</style>