<template>
  <div id="bot-area" class="bg-green-500 text-white px-4 py-2 rounded">
    <h2 class="mb-4">Restaurant</h2>
    <div class="mb-2">
      <button class="bg-blue-500 text-white px-4 py-2 rounded w-full" @click="addBot">+ Bot</button>
    </div>
    <div>
      <button class="bg-blue-500 text-white px-4 py-2 rounded w-full" @click="removeBot">- Bot</button>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

defineProps<{ bots: Bot[]; }>();

const emits = defineEmits<{(e: 'add-bot'): void;(e: 'remove-bot'): void;}>();
function addBot() {
  emits('add-bot')
}

function removeBot() {
  emits('remove-bot')
}
</script>

<style scoped>
#bot-area {
  margin-bottom: 20px;
}
</style>
  