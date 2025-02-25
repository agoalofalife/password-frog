<template>
  <button type="submit" @click="$emit('click')" class="btn btn-primary mt-2">
    <slot>Submit</slot>
  </button>
</template>

<script setup>
  const emit = defineEmits(["click"]);
</script>

<style scoped>
.btn {
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
