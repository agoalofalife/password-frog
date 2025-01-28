<template>
  <div class="passwordSetup">
    <h1>Create a Password</h1>
    <input type="password" v-model="password" placeholder="Enter password" />
    <input type="password" v-model="confirmPassword" placeholder="Confirm password" />
    <input type="text" v-model="passwordHint" placeholder="Password hint" />
    <SubmitButton @click="save">Save</SubmitButton>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SubmitButton from "../components/SubmitButton.vue";

const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const router = useRouter();
const passwordHint = ref("")

async function save() {
  if (!password.value || password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }
  await window.api.setPassword(password.value, passwordHint.value);
  router.push(`/textEditor?pw=${encodeURIComponent(password.value)}`);
}
</script>

<style lang="css" scoped>
body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.passwordSetup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
</style>
