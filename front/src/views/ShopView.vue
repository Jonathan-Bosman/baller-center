<template>
    <div class="wrapper">
        <SpinnerLoader v-if="isLoading"/>
        <div
            class='cardContainer'
            v-if="!isLoading
                && products.length>0
                && categories.length>0
                && teams.length>0
                && brands.length>0"
            >
            <ProductCard
                class='card'
                v-for="(product, index) in products"
                :key="index"
                :id="product.id"
                :nomProduit="product.name"
                :nomCategorie="categories[product.category-1].name"
                :prix="product.price+100"
                :url="'http://localhost:3000/uploads/'+product.filepath"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import SpinnerLoader from '@/components/SpinnerLoader.vue';

const products = ref();
const categories = ref();
const teams = ref();
const brands = ref();
const isLoading = ref<boolean>(true);

onMounted(async () => {
    const resProducts = await fetch('http://localhost:3000/api/products/',{
          headers: {'Content-Type': 'application/json'}
        });
    products.value = await resProducts.json();
    const resCategories = await fetch('http://localhost:3000/api/categories/',{
          headers: {'Content-Type': 'application/json'}
        });
    categories.value = await resCategories.json();
    const resTeams = await fetch('http://localhost:3000/api/teams/',{
          headers: {'Content-Type': 'application/json'}
        });
    teams.value = await resTeams.json();
    const resBrands = await fetch('http://localhost:3000/api/brands/',{
          headers: {'Content-Type': 'application/json'}
        });
    brands.value = await resBrands.json();
    isLoading.value = false;
})
</script>

<style scoped>
.wrapper{
    margin: auto;
    width: 95%;
}

.cardContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
}

.card{
    width: 45%;
    margin-top: 2rem;
}

@media screen and (min-width: 767px) {
    .card{
    width: 30%;
    }
}
</style>