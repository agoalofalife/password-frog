<template>


  <div class="wrapper">
  
    <div class="searchbar">
      <Searchbar></Searchbar>
    </div>

    <div class="cards_window">
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
    </div>
    
  </div>


</template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import Card from "../components/Card.vue";
  import Searchbar from "../components/Searchbar.vue";

  onMounted(async () => {
    //pass
  });
  
  </script>
  
  <style scoped>

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .searchbar {
      margin-bottom: 1%;
    }

    .cards_window {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1vw;
    }
  </style>
  