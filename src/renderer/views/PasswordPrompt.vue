<template>
  <div class="passwordPromt">
    <h1>Enter your Password</h1>
    <input type="password" v-model="password" placeholder="Password" />
    <SubmitButton v-if="!isTouchIdAuthenticated" @click="login">Login with password</SubmitButton>
    <div class="error-container">
      <p v-if="error">{{ error }}</p>
    <SubmitButton v-if="!isTouchIdAuthenticated && !error" @click="loginWithTouchId">Login with Touch ID</SubmitButton>
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
const isTouchIdAuthenticated = ref(false);

async function login() {
  const valid = await window.api.verifyPassword(password.value);
  if (valid) {
    router.push(`/textEditor?pw=${encodeURIComponent(password.value)}`);
  } else {
    error.value = "Invalid password";
  }
}

async function loginWithTouchId() {
  const password = await window.api.loginWithTouchId(); 
  if (password) {
    isTouchIdAuthenticated.value = true;
    router.push(`/textEditor?pw=${encodeURIComponent(password)}`);
  } else {
    error.value = "Touch ID authentication failed";
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
