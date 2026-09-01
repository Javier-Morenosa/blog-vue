<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  code: { type: String, required: true }
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = props.code
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <button class="copy-btn" :class="{ copied }" @click="copyCode">
    {{ copied ? '✓ copied' : 'copy' }}
  </button>
</template>