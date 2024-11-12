<template>
    <div class="cardContainer">
      <div class="image">
      </div>
      <div class="description">
        <p>{{ props.nomProduit }}</p>
        <p>{{ props.nomCategorie }}</p>
        <p>{{ props.prix/100 }}€</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    id: Number,
    nomProduit: String,
    nomCategorie: String,
    prix: Number,
});
</script>

<style scoped>
.cardContainer {
    display: flex;
    flex-direction: column;
}
.image{    
    background-image: url('https://ralfvanveen.com/wp-content/uploads/2021/06/Espace-r%C3%A9serv%C3%A9-_-Glossaire.svg');
    background-size: cover;
    min-width: 1rem;
    aspect-ratio: 16/12;
    border: solid 1px #0F0F0F;
    font-size: 14px;
    width: 100%;
}
.description{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.description>p{
    margin: 0;
    padding: 0;
}
</style>