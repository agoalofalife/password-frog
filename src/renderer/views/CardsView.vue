<template>
    <div class="container">
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
    </div>

</template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import Card from "../components/Card.vue";

  onMounted(async () => {
    //pass
  });
  
  </script>
  
  <style scoped>

    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1vw;
    }
  </style>
  