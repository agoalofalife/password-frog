<template>
  <div class="wrapper">
    <div class="searchbar">
      <Searchbar></Searchbar>
    </div>

    <div class="cards_window">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :card="card"
      />
      <div class="add-card-btn" @click="addCard">
        +
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Card from "../components/Card.vue";
import Searchbar from "../components/Searchbar.vue";

const text = ref("");
const route = useRoute();
const password = decodeURIComponent(route.query.pw);

const cards = ref([]);

onMounted(async () => {
  try {
    const storedText = await window.api.loadNotes(password);
    text.value = storedText;

    cards.value = [];
  } catch (error) {
    console.error(`Failed to load notes: ${error.message}`);
    alert('Failed to load notes. Please check the logs for details.');
  }
});

async function saveNotes() {
  await window.api.saveNotes(password, text.value);
}

function addCard() {
  cards.value.push({
    type: "",
    title: "",
    login: "",
    password: ""
  });
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.searchbar {
  margin-bottom: 2vh;
}

.cards_window {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3vw;
}

.add-card-btn {
  width: 100px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: gray;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-card-btn:hover {
  color: rgb(90, 90, 90);
}
</style>
