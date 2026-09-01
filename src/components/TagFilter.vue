<script setup>
const props = defineProps({
  tags: { type: Array, default: () => [] },
  activeTag: { type: String, default: '' }
})

const emit = defineEmits(['select'])

function select(tag) {
  emit('select', tag === props.activeTag ? '' : tag)
}
</script>

<template>
  <div class="tag-filter-bar" v-if="tags.length">
    <button
      v-for="tag in tags"
      :key="tag"
      class="tag-chip mono"
      :class="{ active: activeTag === tag }"
      @click="select(tag)"
    >#{{ tag }}</button>
  </div>
</template>