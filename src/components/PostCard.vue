<script setup>
defineProps({
  post: { type: Object, required: true }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <RouterLink :to="`/post/${post.slug}`" class="post-card">
    <div class="post-card-inner">
      <div class="post-meta mono">
        <span class="post-date">{{ formatDate(post.date) }}</span>
        <span class="meta-sep text-tertiary">·</span>
        <span class="post-reading text-tertiary">{{ post.readingTime }} min read</span>
      </div>
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-tags mono">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </div>
    <div class="post-arrow text-tertiary">→</div>
  </RouterLink>
</template>

<style scoped>
.post-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--surface-border);
  transition: border-color 0.3s ease;
  color: inherit;
}

.post-card:hover {
  border-bottom-color: var(--surface-border-hover);
}

.post-card-inner {
  flex: 1;
}

.post-meta {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.meta-sep {
  margin: 0 0.4rem;
}

.post-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-tight);
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.post-card:hover .post-title {
  color: var(--text-accent);
}

.post-excerpt {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.post-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.post-arrow {
  font-size: var(--font-size-lg);
  margin-top: 0.25rem;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.post-card:hover .post-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--text-accent);
}

@media (max-width: 600px) {
  .post-arrow {
    display: none;
  }
}
</style>