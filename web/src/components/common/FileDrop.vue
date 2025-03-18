<template>
  <div
    :class="{ active: active }"
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <div
      v-if="active"
      style="position: absolute; width: 100%; height: 100%"
    >
      <div class="text-center">
        <h1>Drop Files Here</h1>
      </div>
    </div>

    <div :style="{ opacity: active ? '0.05' : '1' }">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const emit = defineEmits(["files-dropped"])

let active = ref(false)
let inActiveTimeout = null

function setActive() {
  active.value = true
  clearTimeout(inActiveTimeout)
}
function setInactive() {
  inActiveTimeout = setTimeout(() => {
    active.value = false
  }, 50)
}

function onDrop(e) {
  setInactive()
  emit("files-dropped", [...e.dataTransfer.files])
}

function preventDefaults(e) {
  e.preventDefault()
}

const events = ["dragenter", "dragover", "dragleave", "drop"]

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults)
  })
})

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults)
  })
})
</script>

<style scoped>
div.active {
  background-color: #00ff0011 !important;
}
</style>
