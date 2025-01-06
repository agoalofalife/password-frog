<template>
  <form class="form">
    <div class="form-group flex-grow-1 w-100">
      <textarea
        class="form-control textarea"
        placeholder="Enter the text to encrypt"
        id="textToEncrypt"
        :value="modelValue"
        @input="onInput"
      ></textarea>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<style scoped>
.textarea {
  background-color: #e3eaf5;
  border: 1px solid #b0c4de;
  color: #333333;
  padding: 15px;
  font-size: 16px;
  border-radius: 4px;
  height: 70vh;
  width: 90vw;
}
</style>
