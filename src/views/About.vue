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
        <h1 class="hero-title">Javier Sánchez Moreno</h1>

        <div class="about-text">
          <p>
            AI engineer at <strong>Banco Santander</strong>. I work across the
            full spectrum of artificial intelligence — from traditional ML to
            generative AI. Currently researching new workflows and technologies
            around <strong>LLMs</strong> and <strong>agentic systems</strong>,
            looking for the vertex of AI.
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
          <span class="prompt-char">$</span> scroll ↓
        </p>
      </div>
    </section>

    <!-- Manifesto panel -->
    <section class="panel manifesto-panel">
      <div class="manifesto-content">
        <p class="manifesto-label mono text-tertiary">
          <span class="prompt-char">$</span> echo $BLOG_PURPOSE
        </p>
        <p class="manifesto-text">
          This blog exists as an act of sharing — thoughts, knowledge, and
          experiments with the community.
        </p>
        <p class="manifesto-text">
          The design parodies the infinite auto-scrolling that so effectively
          captures human attention. You came here to read. The scroll keeps
          you reading. Whether that's a feature or a bug is up to you.
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

/* ── Manifesto ──────────────────────────────────────── */
.manifesto-content {
  max-width: 560px;
  text-align: center;
}

.manifesto-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.manifesto-text {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
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

  .about-text, .manifesto-text {
    font-size: var(--font-size-base);
  }
}
</style>