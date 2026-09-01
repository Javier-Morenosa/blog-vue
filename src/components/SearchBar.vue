<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="search-wrap">
    <span class="search-icon">$</span>
    <input
      class="search-input"
      type="text"
      :value="modelValue"
      @input="onInput"
      placeholder="grep posts..."
    />
  </div>
</template>