<template>
    <form @submit.prevent="handleSearch">
        <label for="search"></label>
        <input type="text" placeholder="Search.." name="search" v-model="searchQuery">
        <img class="search_img" src="../assets/icons/search-svgrepo-com.svg" @click="handleSearch">
    </form>
</template>

<script setup>
    import { ref } from 'vue';

    const emit = defineEmits(["search"]);
    const searchQuery = ref('');

    const handleSearch = () => {
        emit('search', searchQuery.value);
    };
</script>

<style scoped>

form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
}

input {
    background-color: grey;
    border: 2px solid transparent;
    border-radius: 25px;
}

.search_img {
    width: 20px;
    filter: invert(55%) sepia(12%) saturate(17%) hue-rotate(339deg) brightness(89%) contrast(84%);
    cursor: pointer;
}
</style>
