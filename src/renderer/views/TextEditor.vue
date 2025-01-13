<template>
  <div class="text_editor">
    <TextArea v-model="text"></TextArea>
    <SubmitButton @click="saveNotes">Encrypt&Save text</SubmitButton>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import SubmitButton from "../components/SubmitButton.vue";
import TextArea from "../components/TextArea.vue";

const text = ref("");
const route = useRoute();
const password = decodeURIComponent(route.query.pw);

onMounted(async () => {
  try {
    const storedText = await window.api.loadNotes(password);
    text.value = storedText; 
  } catch (error) {
    console.error('Failed to load notes:', error.message);
    alert('Failed to load notes. Please check the logs for details.');
  }
});

async function saveNotes() {
  await window.api.saveNotes(password, text.value);
}
</script>

<style scoped>
.text_editor {
  /* Fill the entire window, for example */
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0; /* reset default margin if needed */
}
</style>
