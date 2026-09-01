<script setup>
import projects from '../data/projects.js'
</script>

<template>
  <div class="projects-snap">
    <!-- Intro panel -->
    <section class="panel intro-panel">
      <div class="intro-content">
        <p class="hero-prompt mono text-tertiary">
          <span class="prompt-char">$</span> ls projects/
        </p>
        <h1 class="hero-title">Projects</h1>
        <p class="hero-subtitle text-secondary">
          Open-source research in NLP and information retrieval.
        </p>
        <p class="scroll-hint mono text-tertiary">
          <span class="prompt-char">$</span> scroll ↓
        </p>
      </div>
    </section>

    <!-- One panel per project -->
    <section
      v-for="project in projects"
      :key="project.name"
      class="panel project-panel"
    >
      <a
        :href="project.url"
        target="_blank"
        rel="noopener"
        class="project-content"
      >
        <div class="project-header">
          <span class="project-name mono">{{ project.name }}</span>
          <span class="project-lang mono text-tertiary">{{ project.language }}</span>
        </div>
        <p class="project-desc text-secondary">{{ project.description }}</p>
        <div class="project-tags mono">
          <span v-for="tag in project.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <p class="open-link mono text-accent">open on github →</p>
      </a>
    </section>

    <!-- Back panel -->
    <section class="panel back-panel">
      <RouterLink to="/" class="mono text-accent">
        ↑ back to posts
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.projects-snap {
  display: flex;
  flex-direction: column;
}

.prompt-char {
  color: var(--accent);
  margin-right: 0.4rem;
}

.intro-content {
  text-align: center;
  max-width: var(--max-width);
}

.hero-prompt {
  font-size: var(--font-size-sm);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
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

/* ── Project panels ─────────────────────────────────── */
.project-content {
  max-width: 560px;
  text-align: center;
  padding: 2rem;
  color: inherit;
}

.project-header {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.project-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.project-content:hover .project-name {
  color: var(--text-accent);
}

.project-lang {
  font-size: var(--font-size-xs);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.project-desc {
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.open-link {
  font-size: var(--font-size-sm);
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.project-content:hover .open-link {
  opacity: 1;
  transform: translateY(0);
}

/* ── Back panel ─────────────────────────────────────── */
.back-panel a {
  font-size: var(--font-size-sm);
}

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .project-name {
    font-size: var(--font-size-xl);
  }
}
</style>