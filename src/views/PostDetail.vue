<script setup>
import { computed, ref, onMounted, onUpdated, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import posts from '../data/posts.js'

const route = useRoute()
const router = useRouter()

const post = computed(() =>
  posts.find(p => p.slug === route.params.slug)
)

const sortedPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
)

const currentIdx = computed(() =>
  sortedPosts.value.findIndex(p => p.slug === route.params.slug)
)

const prevPost = computed(() =>
  currentIdx.value < sortedPosts.value.length - 1 ? sortedPosts.value[currentIdx.value + 1] : null
)

const nextPost = computed(() =>
  currentIdx.value > 0 ? sortedPosts.value[currentIdx.value - 1] : null
)

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function parseSections(body) {
  const blocks = body.split(/^## /m)
  const sections = []
  const intro = blocks[0].trim()
  if (intro) {
    sections.push({ title: null, html: renderBlock(intro) })
  }
  for (let i = 1; i < blocks.length; i++) {
    const lines = blocks[i].split('\n')
    const title = lines[0].trim()
    const content = lines.slice(1).join('\n').trim()
    sections.push({ title, html: renderBlock(content) })
  }
  return sections
}

function renderBlock(text) {
  const codeParts = text.split('```')
  let html = ''
  for (let i = 0; i < codeParts.length; i++) {
    if (i % 2 === 0) {
      html += renderMarkdown(codeParts[i])
    } else {
      const langEnd = codeParts[i].indexOf('\n')
      const code = codeParts[i].slice(langEnd + 1)
      html += `<pre data-code="${encodeURIComponent(code)}"><code>${escapeHtml(code)}</code></pre>`
    }
  }
  return html
}

function renderMarkdown(text) {
  return text
    .split('\n')
    .map(line => {
      if (line.startsWith('### ')) return `<h3>${inline(line.slice(4))}</h3>`
      if (line.startsWith('# ')) return `<h1>${inline(line.slice(2))}</h1>`
      if (line.startsWith('```')) return ''
      if (line.startsWith('- ')) return `<li>${inline(line.slice(2))}</li>`
      if (/^\d+\.\s/.test(line)) return `<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>`
      if (line.trim() === '') return '<br>'
      return `<p>${inline(line)}</p>`
    })
    .join('\n')
}

function inline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function injectCopyButtons() {
  nextTick(() => {
    const pres = document.querySelectorAll('.section-body pre[data-code]')
    pres.forEach(pre => {
      if (pre.querySelector('.copy-btn')) return
      const code = decodeURIComponent(pre.dataset.code)
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = 'copy'
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = '✓ copied'
          btn.classList.add('copied')
          setTimeout(() => {
            btn.textContent = 'copy'
            btn.classList.remove('copied')
          }, 2000)
        } catch (e) {
          const ta = document.createElement('textarea')
          ta.value = code
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
      })
      pre.appendChild(btn)
    })
  })
}

onMounted(() => {
  injectCopyButtons()
})

onUpdated(() => {
  injectCopyButtons()
})

watch(() => route.params.slug, () => {
  injectCopyButtons()
})
</script>

<template>
  <div v-if="post" class="post-snap">
    <!-- Header panel -->
    <section class="panel header-panel">
      <div class="header-content">
        <button class="back-btn mono text-tertiary" @click="router.push('/')">
          ← cd ..
        </button>
        <div class="post-meta mono text-tertiary">
          <span>{{ formatDate(post.date) }}</span>
          <span class="meta-sep">·</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-tags mono">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <p class="scroll-hint mono text-tertiary">
          <span class="prompt-char">$</span> scroll ↓ to read
        </p>
      </div>
    </section>

    <!-- Content sections as panels -->
    <section
      v-for="(section, i) in parseSections(post.body)"
      :key="i"
      class="panel content-panel"
    >
      <div class="section-content">
        <h2 v-if="section.title" class="section-title mono text-accent">
          ## {{ section.title }}
        </h2>
        <div class="section-body" v-html="section.html"></div>
      </div>
    </section>

    <!-- Navigation panel -->
    <section class="panel nav-panel">
      <div class="nav-content">
        <p class="panel-label mono text-tertiary">
          <span class="prompt-char">$</span> ls posts/
        </p>
        <div class="post-nav">
          <RouterLink
            v-if="prevPost"
            :to="`/post/${prevPost.slug}`"
            class="post-nav-link prev"
          >
            <span class="nav-label mono text-tertiary">← prev</span>
            <span class="nav-title text-secondary">{{ prevPost.title }}</span>
          </RouterLink>
          <span v-else></span>

          <RouterLink
            v-if="nextPost"
            :to="`/post/${nextPost.slug}`"
            class="post-nav-link next"
          >
            <span class="nav-label mono text-tertiary">next →</span>
            <span class="nav-title text-secondary">{{ nextPost.title }}</span>
          </RouterLink>
        </div>
        <RouterLink to="/" class="home-link mono text-accent">
          ↑ back to all posts
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="panel">
    <div style="text-align: center;">
      <p class="mono text-tertiary">
        <span class="prompt-char">$</span> cat {{ route.params.slug }}.md
      </p>
      <p class="text-secondary" style="margin-top: 1rem;">404 — post not found</p>
      <RouterLink to="/" class="mono" style="display: inline-block; margin-top: 1rem;">← back home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.post-snap {
  display: flex;
  flex-direction: column;
}

.prompt-char {
  color: var(--accent);
  margin-right: 0.4rem;
}

.header-content {
  max-width: var(--max-width);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-xs);
  padding: 0;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--text-accent);
}

.post-meta {
  font-size: var(--font-size-xs);
}

.meta-sep {
  margin: 0 0.4rem;
}

.post-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: var(--line-height-tight);
  letter-spacing: -0.03em;
  max-width: 680px;
}

.post-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.scroll-hint {
  font-size: var(--font-size-xs);
  margin-top: 2rem;
  animation: bob 2s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(6px); opacity: 1; }
}

.section-content {
  max-width: var(--max-width);
  width: 100%;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin-bottom: 2rem;
  letter-spacing: -0.01em;
}

.section-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
}

.section-body :deep(h3) {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.section-body :deep(li) {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.section-body :deep(strong) {
  font-weight: 600;
}

.section-body :deep(code) {
  font-family: var(--font-mono);
}

.section-body :deep(pre) {
  margin: 1.5rem 0;
}

.nav-content {
  max-width: var(--max-width);
  width: 100%;
  text-align: center;
}

.panel-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.post-nav-link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 48%;
  color: inherit;
  transition: color 0.2s ease;
}

.post-nav-link:hover {
  color: var(--accent);
}

.nav-label {
  font-size: var(--font-size-xs);
}

.nav-title {
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.post-nav-link:hover .nav-title {
  color: var(--accent);
}

.post-nav-link.next {
  text-align: right;
  margin-left: auto;
}

.home-link {
  font-size: var(--font-size-sm);
  display: inline-block;
}

@media (max-width: 640px) {
  .post-title {
    font-size: var(--font-size-2xl);
  }

  .post-nav {
    flex-direction: column;
    gap: 1.5rem;
  }

  .post-nav-link.next {
    text-align: left;
    margin-left: 0;
  }
}
</style>