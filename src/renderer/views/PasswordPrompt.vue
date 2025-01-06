<template>
  <div class="passwordPromt">
    <h1>Enter your Password</h1>
    <input type="password" v-model="password" placeholder="Password" />
    <SubmitButton @click="login"></SubmitButton>
    <div class="error-container">
      <p v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SubmitButton from "../components/SubmitButton.vue";

const password = ref("");
const error = ref("");
const router = useRouter();

async function login() {
  const valid = await window.api.verifyPassword(password.value);
  if (valid) {
    router.push("/textEditor?pw=" + encodeURIComponent(password.value));
  } else {
    error.value = "Invalid password";
  }
}
</script>

<style lang="css" scoped>
body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.passwordPromt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.error-container {
  min-height: 10vh; /* Enough for one line of error text */
}
</style>
