<script setup>
defineProps({
  prev: { type: Object, default: null },
  next: { type: Object, default: null }
})
</script>

<template>
  <nav class="post-nav" v-if="prev || next">
    <RouterLink
      v-if="prev"
      :to="`/post/${prev.slug}`"
      class="post-nav-link prev"
    >
      <span class="post-nav-label mono">← prev</span>
      <span class="post-nav-title">{{ prev.title }}</span>
    </RouterLink>
    <span v-else></span>

    <RouterLink
      v-if="next"
      :to="`/post/${next.slug}`"
      class="post-nav-link next"
    >
      <span class="post-nav-label mono">next →</span>
      <span class="post-nav-title">{{ next.title }}</span>
    </RouterLink>
  </nav>
</template>