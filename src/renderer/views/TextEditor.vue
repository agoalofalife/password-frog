<template>
  <div class="text_editor">
    <TextArea v-model="text"></TextArea>
    <SubmitButton @click="saveNotes">Save</SubmitButton>
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
  const storedText = await window.api.loadNotes(password);
  text.value = storedText;
});

async function saveNotes() {
  await window.api.saveNotes(password, text.value);
  alert("Notes saved securely!");
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
