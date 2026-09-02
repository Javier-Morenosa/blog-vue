<script setup>
import { computed, ref } from 'vue'
import posts from '../data/posts.js'
import PostCard from '../components/PostCard.vue'

const sortedPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
)

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="home-snap">
    <!-- Hero panel -->
    <section class="panel hero-panel" data-panel="hero">
      <div class="hero-content">
        <p class="hero-prompt mono text-tertiary">
          <span class="prompt-char">$</span> whoami
        </p>
        <h1 class="hero-title">
          Javier<br>Sánchez Moreno
        </h1>
        <p class="hero-subtitle text-secondary">
          AI engineer at Banco Santander. Exploring LLMs, agentic systems,
          and the vertex of artificial intelligence.
        </p>
        <p class="scroll-hint mono text-tertiary">
          <span class="prompt-char">$</span> scroll ↓ or wait
        </p>
      </div>
    </section>

    <!-- Post panels -->
    <section
      v-for="post in sortedPosts"
      :key="post.slug"
      class="panel post-panel"
      :data-panel="post.slug"
    >
      <RouterLink :to="`/post/${post.slug}`" class="post-panel-content">
        <div class="post-panel-meta mono text-tertiary">
          <span>{{ formatDate(post.date) }}</span>
          <span class="meta-sep">·</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
        <h2 class="post-panel-title">{{ post.title }}</h2>
        <p class="post-panel-excerpt text-secondary">{{ post.excerpt }}</p>
        <div class="post-panel-tags mono">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <p class="read-more mono text-accent">read →</p>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home-snap {
  display: flex;
  flex-direction: column;
}

/* ── Hero ───────────────────────────────────────────── */
.hero-panel {
  text-align: center;
}

.hero-content {
  max-width: var(--max-width);
}

.hero-prompt {
  font-size: var(--font-size-sm);
  margin-bottom: 1.5rem;
}

.prompt-char {
  color: var(--accent);
  margin-right: 0.4rem;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  line-height: var(--line-height-tight);
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.5;
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

/* ── Post panels ────────────────────────────────────── */
.post-panel-content {
  max-width: var(--max-width);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
  padding: 2rem;
}

.post-panel-meta {
  font-size: var(--font-size-xs);
  margin-bottom: 1.5rem;
}

.meta-sep {
  margin: 0 0.4rem;
}

.post-panel-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: var(--line-height-tight);
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
  max-width: 680px;
  transition: color 0.3s ease;
}

.post-panel-content:hover .post-panel-title {
  color: var(--text-accent);
}

.post-panel-excerpt {
  font-size: var(--font-size-lg);
  max-width: 520px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.post-panel-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.read-more {
  font-size: var(--font-size-sm);
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.post-panel-content:hover .read-more {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .post-panel-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle,
  .post-panel-excerpt {
    font-size: var(--font-size-base);
  }
}
</style>