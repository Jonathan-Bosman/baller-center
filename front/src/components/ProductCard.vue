<template>
    <div class="cardContainer">
        <div class='imageWrapper'>
            <img :src="imageSrc" @error="imageLoadError" :alt="props.nomProduit" />
        </div> 
      <div class="description">
        <p>{{ props.nomProduit }}</p>
        <p>{{ props.nomCategorie }}</p>
        <p>{{ props.prix?`${((props.prix) + "").slice(0,((props.prix) + "").length-2)},${((props.prix) + "").slice(((props.prix) + "").length-2)}`:'0,00' }}€</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import noImage from '../assets/NoImage.png';

const props = defineProps({
    id: Number,
    nomProduit: String,
    categoryId: Number,
    nomCategorie: String,
    teamId: Number,
    nomEquipe: String,
    couleurEquipe: String,
    brandId: Number,
    nomMarque: String,
    varation: String,
    anneeCreation: Number,
    prix: Number,
    url: String
});

const imageSrc = ref(props.url);

const imageLoadError = () => {
    if (imageSrc.value !== noImage) {
        imageSrc.value = noImage;
    }
}
</script>

<style scoped>
.cardContainer {
    display: flex;
    flex-direction: column;
}

.imageWrapper{
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/12;
    border: solid 1px #0F0F0F;
    width: 100%;
}

img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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